"use client";

import { useEffect, useState } from "react";

export default function UsersFilters() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);



    async function fetchUsers(searchValue: string) {
        setLoading(true);

        const res = await fetch("/api/user/getUsers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchValue }),
        });

        const data = await res.json();
        setUsers(data.user);

        setLoading(false);
    }

    useEffect(() => {
        fetchUsers("");
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="container mx-auto py-6 text-text">
            {/* عنوان */}
            <h1 className="text-2xl font-bold mb-6">
                All Users{" "}
                <span className="text-sm opacity-80">({users.length})</span>
            </h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 mb-6 rounded-lg border border-border bg-background-light"
            />

            {/* Loading */}
            {loading && (
                <p className="text-sm opacity-70 mb-4">Loading...</p>
            )}

            {/* Users List */}
            <div className="flex flex-col gap-6">
                {users.map((user: User) => (
                    <div
                        key={user._id}
                        className="p-4 bg-background-light rounded-lg shadow-sm border border-border"
                    >
                        {/* User Info */}
                        <div className="mb-4">
                            <p className="m-0 text-sm opacity-80">
                                User ID: {user._id}
                            </p>
                            <p className="m-0 text-sm opacity-80">
                                Email: {user.email}
                            </p>
                            <p className="m-0 text-sm opacity-80">
                                Name: {user.firstName} {user.lastName}
                            </p>
                            <p className="m-0 text-sm opacity-80">
                                Phone: {user.phone}
                            </p>
                        </div>

                        {/* Orders */}
                        <h3 className="font-semibold mb-2">
                            Orders{" "}
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
                                {user.orders.map((ord, idx: number) => {
                                    const order: Order = ord.orderId;
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
