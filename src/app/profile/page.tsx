import { cookies } from "next/headers";
import LogoutButton from "../../components/custom/Logout/Logout";
import Image from "next/image";

export default async function ProfilePage() {
    const token = cookies().get("token")?.value;

    const res = await fetch(`${process.env.API}/api/user/getUserInfo`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `token=${token}`,
        },
        cache: "no-store",
    });

    const data: APIResponse<LoginResponse> = await res.json();
    if (data.msg === "error") {
        return (<p>user not found</p>)
    }
    const user = data?.user;
    return (
        <div className="container mx-auto my-4 text-text">
            {/* User Info */}
            <div className="mb-6 p-4 bg-background-light rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-between mb-3 font-semibold">
                    <h2 className="text-2xl m-0">Your Profile </h2>
                    <LogoutButton />
                </div>
                <p className="m-0"><span className="font-semibold">email:</span> {user?.email}</p>
                <p className="m-0"><span className="font-semibold">Name:</span> {user?.firstName} {user?.lastName}</p>
                <p className="m-0"><span className="font-semibold">Phone:</span> {user?.phone}</p>
            </div>


            {/* Orders */}
            <h2 className="text-2xl font-semibold mb-4">Your Orders <span className="text-sm">(total {user?.orders?.length})</span></h2>


            <div className="flex flex-col gap-4">
                {user?.orders?.length === 0 && (
                    <div className="p-4 bg-background-light rounded-lg shadow-sm border border-border text-center">
                        No orders yet.
                    </div>
                )}


                {user?.orders?.map((ord, idx) => {
                    const order = ord?.orderId
                    return (
                        <div
                            key={idx}
                            className="p-4 bg-background-light rounded-lg shadow-sm border border-border"
                        >
                            {/* Order Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">Order #{order?.randomId}</h3>
                                    <p className="text-sm opacity-80">Status: {order?.status}</p>
                                    <p className="text-sm opacity-80">
                                        Date:
                                        {order?.createdAt && !isNaN(new Date(order.createdAt).getTime())
                                            ? new Date(order.createdAt).toISOString().split("T")[0]
                                            : "-"}
                                    </p>                                </div>
                                <div className="font-bold text-lg">Total: {order?.totalPrice} LE</div>
                            </div>


                            {/* Order Items */}
                            <div className="border-t border-border pt-4">
                                {order?.products?.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`flex justify-between items-center pb-3 ${i !== order?.products.length - 1 ? "border-b border-border mb-3" : ""
                                            }`}
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
                                                    className="rounded  object-cover select-none"
                                                    sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 112px"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold m-0">{item.productId?.name}</p>
                                                <p className="m-0 text-sm opacity-80">Color: {item.color}</p>
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
                            <div className="pt-4 text-sm opacity-90">
                                <p className="m-0">Subtotal: {order?.subtotal} LE</p>
                                <p className="m-0">Shipping: {order?.shippingCost} LE</p>
                                <p className="font-bold mt-1">Total: {order?.totalPrice} LE</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
