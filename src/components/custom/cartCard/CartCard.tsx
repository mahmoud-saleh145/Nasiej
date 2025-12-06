"use client";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useAddQuantity, useCart, useDecreaseQuantity, useEmptyCart, useRemoveProduct } from "@/hooks/useCart";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPage from "@/components/common/LoadingPage";
import EmptyCart from "../emptyCart/EmptyCart";
import Image from "next/image";

export default function CartCard() {
    const { data: cart, isLoading, isError } = useCart();
    const emptyCart = useEmptyCart();
    const addQuantity = useAddQuantity();
    const decreaseQuantity = useDecreaseQuantity();
    const removeProduct = useRemoveProduct();
    if (isLoading) return <LoadingPage />;
    if (isError) return <p>Something went wrong fetching your cart.</p>;

    return (
        <div className="cards-animation">
            {cart?.cart.items.length === 0 ?
                <EmptyCart />
                :
                <div>
                    <div className="mb-4 p-4 bg-background-light rounded-lg shadow-sm border border-border text-text">
                        <h2 className="text-2xl font-semibold mb-3">Your Shopping Cart</h2>
                        <div className="d-flex flex-wrap justify-content-between gap-3">
                            <div className="">
                                <p className="m-0">
                                    <span className="fw-semibold">Items:</span> {cart?.cart.items?.length || 0}
                                </p>
                                <p className="m-0">
                                    <span className="fw-semibold">Total Quantity:</span> {cart?.totalQuantity || 0}
                                </p>

                            </div>
                            <p className="m-0  fw-bold">
                                <span>Total:</span> {cart?.subtotal} LE
                            </p>
                        </div>
                    </div>

                    {cart?.cart.items.map((product: CartItem, index: number) => (
                        <div
                            key={index}
                            className={`d-flex align-items-center justify-content-between p-3 bg-background-light ${index !== cart.cart.items.length - 1 ? "border-bottom" : ""}`}>
                            <Link

                                href={`/productDetails/${product.productId._id}`}
                                className="d-flex align-items-center text-decoration-none text-text flex-grow-1 link-underline link-underline-opacity-0"
                            >
                                <div className="relative w-28 h-28 me-3 ">

                                    <Image
                                        src={
                                            product.productId.variants.find(v => v.color === product.color)?.images?.[0]?.url
                                            || product.productId.variants[0]?.images?.[0]?.url
                                        }
                                        alt={product.productId.name}
                                        className="rounded "
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 112px"

                                    />
                                </div>
                                <div>
                                    <p className="m-0 fw-bold">{product.productId.name}</p>

                                    <span className="fw-bold text-base text-text mt-3">

                                        {product.productId.discount && product.productId.discount > product.productId.raise ?

                                            <small className="text-text-secondary me-1 "><del>{product.productId.price}</del></small>
                                            :
                                            product.productId.discount && product.productId.discount < product.productId.raise ?
                                                <small className="text-text-secondary me-1 "><del>{product.productId.price + (product.productId.price * product.productId.raise) / 100}</del></small>
                                                : ''
                                        }

                                        {product.productId.discount && product.productId.raise
                                            ? product.productId.price -
                                            (product.productId.price * product.productId.discount) / 100 +
                                            (product.productId.price * product.productId.raise) / 100
                                            : product.productId.raise ?
                                                product.productId.price + (product.productId.price * product.productId.raise) / 100
                                                : product.productId.discount
                                                    ? product.productId.price - (product.productId.price * product.productId.discount) / 100
                                                    : product.productId.price} LE
                                    </span>
                                    <div className="">
                                        <span className="text-text">Color: {product.color || "N/A"}</span>
                                    </div>

                                </div>
                            </Link>

                            <div className="d-flex flex-column align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="bg-buttons text-text rounded-lg hover:bg-buttons-hover p-1.5"
                                        disabled={addQuantity.isPending}
                                        onClick={() => {
                                            addQuantity.mutate({ productId: product.productId._id, color: product.color });
                                        }}
                                    >
                                        <FaPlus />
                                    </button>
                                    <h6 className="m-0 text-text">{product.quantity}</h6>
                                    <button
                                        className="bg-buttons text-text rounded-lg hover:bg-buttons-hover p-1.5"
                                        disabled={decreaseQuantity.isPending}
                                        onClick={() => decreaseQuantity.mutate({ productId: product.productId._id, color: product.color })}
                                    >
                                        <FaMinus />
                                    </button>
                                </div>
                                <button className="text-danger border-0 bg-transparent"
                                    disabled={removeProduct.isPending}
                                    onClick={() => removeProduct.mutate({ productId: product.productId._id, color: product.color })}>
                                    <FaRegTrashCan />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex mt-4 align-items-center justify-center gap-3">
                        <ConfirmDialog
                            trigger={
                                <button
                                    className={`bg-buttons text-text rounded-lg hover:bg-buttons-hover p-1.5 px-4 ${emptyCart.isPending ? "opacity-70 " : ""
                                        }`}
                                    disabled={emptyCart.isPending}
                                >
                                    {emptyCart.isPending ? "Clearing..." : "Empty Cart"}
                                </button>
                            }
                            title="Empty Cart"
                            description="Are you sure you want to remove all items from your cart?"
                            confirmText="Yes, empty it"
                            cancelText="Cancel"
                            onConfirm={() => emptyCart.mutate()}
                        />

                        <Link
                            href={{
                                pathname: "/checkout"
                            }}
                            className="bg-buttons text-text rounded-lg hover:bg-buttons-hover p-1.5 px-3 link-underline link-underline-opacity-0 "
                        >
                            Next
                        </Link>
                    </div>

                </div>
            }
        </div>


    );
}
