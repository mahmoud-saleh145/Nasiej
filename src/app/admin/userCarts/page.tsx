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
                {carts?.map((cart) => {
                    const totalItems = cart.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );

                    const totalPrice = cart.items.reduce(
                        (sum, item) => sum + item.quantity * item.productId.price,
                        0
                    );

                    const ownerLabel = cart.userId
                        ? `User ID: ${cart.userId}`
                        : `Session: ${cart.sessionId}`;


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
                                        Items: {totalItems}
                                    </p>
                                </div>

                                <div className="font-bold text-lg">
                                    Total: {totalPrice} LE
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
                                        <div>
                                            <p className="font-semibold m-0">
                                                {item.productId.name}
                                            </p>
                                            <p className="text-sm opacity-80 m-0">
                                                Price: {item.productId.price} LE
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="m-0">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="m-0 font-semibold">
                                                {item.quantity * item.productId.price} LE
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
