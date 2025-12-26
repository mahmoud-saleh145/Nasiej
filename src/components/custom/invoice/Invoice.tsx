'use client'
import LoadingPage from "@/components/common/LoadingPage";
import Image from "next/image";
import Link from "next/link";

export default function Invoice({ order }: { order?: CompleteOrder }) {
    if (!order) return <LoadingPage />;

    const { order: ord } = order;

    return (
        <div className="max-w-3xl mx-auto my-8 px-4">

            {/* --- Order Header --- */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 text-center">
                    Order #{ord.randomId}
                </h2>

                <p className="text-gray-500 text-center mt-3 text-sm">
                    Your order has been successfully placed. We&apos;re preparing it for shipment.
                </p>
            </div>

            {/* --- Order Summary --- */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>

                {/* Items List */}
                <div className="space-y-5 pb-5 border-b">
                    {ord?.products?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">

                            {/* Image */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20">
                                    <Image
                                        src={
                                            item?.productId?.variants?.find(v => v.color === item.color)?.images?.[0]?.url
                                            || item?.productId?.variants[0]?.images?.[0]?.url
                                        }
                                        alt={item.productId.name}
                                        fill
                                        className=" object-cover rounded-lg border select-none"
                                        sizes="100vw"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-lg">
                                        {item.quantity}
                                    </span>
                                </div>

                                {/* Product info */}
                                <div>
                                    <p className="font-medium text-text m-0">
                                        Name: {item.productId.name}
                                    </p>
                                    <p className="font-medium text-text m-0 text-small">
                                        Color: {item.color}
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <span className="fw-bold text-base text-text">

                                {item.productId.discount && item.productId.discount > item.productId.raise ?

                                    <small className="text-text-secondary me-1 "><del>{item.productId.price}</del></small>
                                    :
                                    item.productId.discount && item.productId.discount < item.productId.raise ?
                                        <small className="text-text-secondary me-1 "><del>{item.productId.price + (item.productId.price * item.productId.raise) / 100}</del></small>
                                        : ''
                                }

                                {item.productId.discount && item.productId.raise
                                    ? item.productId.price -
                                    (item.productId.price * item.productId.discount) / 100 +
                                    (item.productId.price * item.productId.raise) / 100
                                    : item.productId.raise ?
                                        item.productId.price + (item.productId.price * item.productId.raise) / 100
                                        : item.productId.discount
                                            ? item.productId.price - (item.productId.price * item.productId.discount) / 100
                                            : item.productId.price} LE
                            </span>
                        </div>
                    ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">
                        Subtotal <small className="text-xs">({ord.products.length} items)</small>
                    </span>
                    <span className="font-medium text-gray-800">{ord.subtotal} LE</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Shipping fee</span>
                    <span className="font-medium text-gray-800">{ord.shippingCost} LE</span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-4 text-xl font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{ord.totalPrice} LE</span>
                </div>
            </div>

            {/* --- Shipping Information --- */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h3>

                <div className="space-y-1 text-gray-700 text-sm leading-relaxed">
                    <p className="mb-0"><span className="font-medium">Email:</span> {ord.email}</p>
                    <p className="mb-0"><span className="font-medium">Name:</span> {ord.firstName} {ord.lastName}</p>
                    <p><span className="font-medium">Address:</span> {ord.address}</p>
                    <p><span className="font-medium">City:</span> {ord.city}</p>
                    <p><span className="font-medium">Governorate:</span> {ord.governorate}</p>
                    <p><span className="font-medium">Phone:</span> {ord.phone}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
                <p className="text-gray-500 mb-4 text-sm">
                    Thank you for shopping with us!
                </p>

                <Link
                    href={"/"}
                    className="link-underline link-underline-opacity-0 inline-block bg-buttons text-text px-6 py-3 rounded-xl text-sm font-medium hover:bg-buttons-hover transition"
                >
                    Continue Shopping
                </Link>
            </div>

        </div>
    );
}
