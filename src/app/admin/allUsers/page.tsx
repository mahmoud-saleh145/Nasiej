export default async function allUsers() {

    const res = await fetch(`${process.env.API}/api/user/getUsers`, {
        cache: "no-store",
    });


    const data = await res.json();
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }


    return (
        <div className="container mx-auto py-6 text-text">
            <h1 className="text-2xl font-bold mb-6">
                All Users <span className="text-sm opacity-80">({data.user.length})</span>
            </h1>

            <div className="flex flex-col gap-6">
                {data.user.map((user: User) => (
                    <div
                        key={user._id}
                        className="p-4 bg-background-light rounded-lg shadow-sm border border-border"
                    >
                        {/* User Info */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="m-0 text-sm opacity-80">Email: {user.email}</p>
                            <p className="m-0 text-sm opacity-80">Phone: {user.phone}</p>
                            <p className="m-0 text-sm opacity-80">
                                User ID: {user._id}
                            </p>
                        </div>

                        {/* Orders Summary */}
                        <h3 className="font-semibold mb-2">
                            Orders
                            <span className="text-sm opacity-70 ml-1">
                                ({user.orders?.length || 0})
                            </span>
                        </h3>

                        {user.orders?.length === 0 && (
                            <div className="p-3 border border-border rounded text-sm opacity-80">
                                No orders for this user.
                            </div>
                        )}

                        {user.orders?.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {user.orders.map((ord, idx) => {
                                    const order = ord.orderId;
                                    return (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center p-3 border border-border rounded"
                                        >
                                            <div>
                                                <p className="m-0 font-semibold">
                                                    Order #{order?.randomId}
                                                </p>
                                                <p className="m-0 text-sm opacity-80">
                                                    Status: {order?.status}
                                                </p>
                                                <p className="m-0 text-sm opacity-80">
                                                    Date:{" "}
                                                    {order?.createdAt
                                                        ? new Date(order.createdAt)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : "-"}
                                                </p>
                                            </div>

                                            <div className="font-bold">
                                                {order?.totalPrice} LE
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

}
