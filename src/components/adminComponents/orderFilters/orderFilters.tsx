"use client";

import { JSON_HEADER } from "@/lib/constants/api.constants";
import { useCallback, useEffect, useState } from "react";
import EditOrderModal from "../editOrderModal/EditOrderModal";
import Image from "next/image";
import AutoText from "@/components/custom/autoText/AutoText";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function OrdersClient() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [maxPages, setMaxPages] = useState(1)
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [openEditOrder, setOpenEditOrder] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    function handleEditOrder(order: Order) {
        setCurrentOrder(order);
        setOpenEditOrder(true);
    }

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            let searchQuery = query.trim();

            const dateMatch = searchQuery.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
            if (dateMatch) {
                const [, day, month, year] = dateMatch;
                searchQuery = `${year}-${month}-${day}`;
            }
            const res = await fetch(`/api/order/getOrders`, {
                method: "POST",
                headers: { ...JSON_HEADER },
                body: JSON.stringify({
                    query: searchQuery,
                    status,
                    sort,
                    page,
                    limit: 10,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (data.msg === "success") {
                setTotal(data.total);
                setOrders(data.orders);
                setMaxPages(data.pages);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [query, status, sort, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    return (
        <div className="text-text">

            {/* Header */}

            <h2 className="text-2xl font-semibold">
                Orders
                <span className="text-sm opacity-80 ml-2">(total {total})</span>
            </h2>

            {/* Filters */}
            <div className="mb-4 ">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg  focus:border-gray-400 me-2 mb-2 "
                    placeholder="Search orders…"
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg me-2 cursor-pointer"
                >
                    <option value="">All status</option>
                    <option value="placed">Placed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg cursor-pointer"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="p-4 bg-background-light rounded-lg border border-border">
                    Loading orders...
                </div>
            )}

            {/* No Orders */}
            {!loading && orders?.length === 0 && (
                <div className="p-4 bg-background-light rounded-lg border border-border">
                    No orders found.
                </div>
            )}

            {/* Orders UI */}
            {!loading && (
                <div className="flex flex-col gap-4">
                    {orders?.map((order: Order) => {
                        const date = new Date(order.createdAt);
                        const formattedDate = `${date.toLocaleDateString("en-GB")} - ${date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}`;
                        return (
                            <div
                                key={order._id}
                                className="p-4 bg-background-light rounded-lg shadow-sm border border-border">
                                <div className="flex md:justify-between md:items-center flex-col md:flex-row mb-3 ">
                                    <h3 className="text-xl flex items-center">
                                        <span className="text-sm mb-0">{order.orderNumber}</span>. Order #<strong>{order.randomId}</strong>
                                    </h3>
                                    <p className="m-0">Status: <strong>{order.status}</strong></p>

                                    <p className="m-0">Date: <strong>{formattedDate}</strong></p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p >Email: <strong>{order.email}</strong></p>
                                        <p>Name:{" "}<strong>  <AutoText text={`${order.firstName} ${order.lastName}`} /></strong></p>
                                        <p>Address: <strong>{order.address}</strong></p>
                                        <p>City: <strong>{order.city}</strong></p>
                                        <p>Governorate: <strong>{order.governorate}</strong></p>
                                        <div className="flex items-center gap-2">

                                            <p className="m-0 ">Phone: <strong>{order.phone}</strong></p>
                                            <Link
                                                href={`https://wa.me/${order.phone}`}
                                                target="_blank"
                                                className="hover:text-plus transition-colors text-text"
                                                aria-label="WhatsApp"
                                            >
                                                <FaWhatsapp size={22} />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="font-bold text-lg">
                                        Total: {order.totalPrice} LE
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4">
                                    {order?.products?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex justify-between items-center pb-3 ${idx !== order.products.length - 1 ? "border-b border-border mb-3" : ""}`}
                                        >
                                            <div className="flex items-center">
                                                <div className="relative w-28 h-28 mr-3 ">

                                                    <Image
                                                        src={
                                                            item?.productId?.variants.find(v => v.color === item.color)?.images?.[0]?.url
                                                            || item?.productId?.variants[0]?.images?.[0]?.url
                                                        }
                                                        alt={item.productId?.name || "product image"}
                                                        fill
                                                        className="rounded object-cover select-none"
                                                        sizes="100vw"

                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold m-0">Name: {item?.productId?.name}</p>
                                                    <p className="m-0 text-sm opacity-80">Color: {item?.color}</p>
                                                    <p className="m-0 text-sm opacity-80">brand: {item?.productId?.brand}</p>
                                                    <p className="m-0 text-sm opacity-80">category: {item?.productId?.category}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="m-0">Qty: {item.quantity}</p>
                                                <p className="m-0 font-semibold">{item.price} LE</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="pt-4 opacity-90">
                                    <p className="m-0">Subtotal: {order.subtotal} LE</p>
                                    <p className="m-0">Shipping: {order.shippingCost} LE</p>
                                    <p className="font-bold mt-1">Total: {order.totalPrice} LE</p>
                                </div>
                                <button
                                    onClick={() => handleEditOrder(order)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Edit Order
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && page > 1 && (
                <div className="flex justify-center mt-6 gap-2">

                    {/* Prev */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={`px-4 py-2 rounded-lg border border-border ${page === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-buttons text-white hover:bg-buttons-hover"
                            }`}
                    >
                        Prev
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: page }).map((_, i) => (
                        <button
                            aria-label={`Go to page ${i + 1}`}
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-lg border border-border ${page === i + 1
                                ? "bg-buttons text-white"
                                : "bg-background-light hover:bg-background-dark"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        disabled={page === maxPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-4 py-2 rounded-lg border border-border ${page === page
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-buttons text-white hover:bg-buttons-hover"
                            }`}
                    >
                        Next
                    </button>

                </div>
            )}
            {openEditOrder && currentOrder && (
                <EditOrderModal
                    order={currentOrder}
                    onClose={() => setOpenEditOrder(false)}
                />
            )}

        </div>

    );
}
