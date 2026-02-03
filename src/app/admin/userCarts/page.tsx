import userModel from "@/lib/models/user.model";
import getFinalPrice from "@/lib/utils/getFinalPrice";
import Image from "next/image";

export default async function userCarts() {

    const res = await fetch(`${process.env.API}/api/cart/getCarts`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch carts");
    }


    const data: EditCart = await res.json();
    const carts = data.cart;

    return (
        <div className="container mx-auto py-6 text-text">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6">
                All Carts
                <span className="text-sm opacity-80 ml-2">
                    ({carts?.length || 0})
                </span>
            </h1>

            {/* No Carts */}
            {(!carts || carts.length === 0) && (
                <div className="p-4 bg-background-light rounded-lg border border-border text-center">
                    No carts found.
                </div>
            )}

            {/* Carts */}
            <div className="flex flex-col gap-6">
                {carts?.map(async (cart) => {
                    const totalItems = cart.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );

                    const subtotal = cart.items.reduce(
                        (acc: number, item: CartItem) => acc + getFinalPrice(item.productId) * item.quantity,
                        0
                    );

                    const ownerLabel = cart.userId
                        ? `User ID: ${cart.userId}`
                        : `Session: ${cart.sessionId}`;


                    const email = await userModel.findById(cart.userId).select('email');
                    return (
                        <div
                            key={cart._id}
                            className="p-4 bg-background-light rounded-lg shadow-sm border border-border"
                        >
                            {/* Cart Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Cart #{cart._id.slice(-6)}
                                    </h2>
                                    <p className="text-sm opacity-80 m-0">
                                        {ownerLabel}
                                    </p>
                                    <p className="text-sm opacity-80 m-0">
                                        Email: {email?.email || "N/A"}
                                    </p>

                                    <p className="text-sm opacity-80 m-0">
                                        created at:{" "}
                                        {new Date(cart.createdAt)
                                            .toISOString()
                                            .split("T")[0]}{" "}
                                        {new Date(cart.createdAt).toLocaleString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                    <p className="text-sm opacity-80 m-0">
                                        updated at:{" "}
                                        {new Date(cart.updatedAt)
                                            .toISOString()
                                            .split("T")[0]}{" "}
                                        {new Date(cart.updatedAt).toLocaleString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                    <p className="text-sm opacity-80 m-0">
                                        Items: {totalItems}
                                    </p>
                                </div>

                                <div className="font-bold text-lg">
                                    Total: {subtotal} LE
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border-t border-border pt-4 flex flex-col gap-3">
                                {cart.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center ${index !== cart.items.length - 1
                                            ? "border-b border-border pb-3"
                                            : ""
                                            }`}
                                    >
                                        <div className="flex items-center">

                                            <div className="relative w-28 h-28 me-3 ">

                                                <Image
                                                    src={
                                                        item.productId.variants.find(v => v.color === item.color)?.images?.[0]?.url
                                                        || item.productId.variants[0]?.images?.[0]?.url
                                                    }
                                                    alt={item.productId.name}
                                                    className="rounded object-cover select-none"
                                                    fill
                                                    sizes="100vw" />
                                            </div>
                                            <div>
                                                <p className="font-semibold m-0">
                                                    {item.productId.name}
                                                </p>
                                                <span className="fw-bold text-base text-text mt-3">

                                                    {item.productId.discount && item.productId.discount > item.productId.raise ?

                                                        <small className="text-text-secondary me-1 "><del>{item.productId.price}</del></small>
                                                        :
                                                        item.productId.discount && item.productId.discount < item.productId.raise ?
                                                            <small className="text-text-secondary me-1 "><del>{item.productId.price + (item.productId.price * item.productId.raise) / 100}</del></small>
                                                            : ''
                                                    }

                                                    {item.productId.finalPrice ?? item.productId.price} LE

                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="m-0">
                                                Qty: {item.quantity}
                                            </p>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}
