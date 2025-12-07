'use client'
import { JSON_HEADER } from "@/lib/constants/api.constants";
import { useState } from "react";


interface InputProps {
    label: string;
    value?: string;
    onChange: (val: string) => void;
}

interface InputNumberProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
}

interface EditOrderModalProps {
    order: Order;
    onClose: () => void;
}
export default function EditOrderModal({ order, onClose }: EditOrderModalProps) {
    const [email, setEmail] = useState(order.email);
    const [firstName, setFirstName] = useState(order.firstName);
    const [lastName, setLastName] = useState(order.lastName);
    const [address, setAddress] = useState(order.address);
    const [phone, setPhone] = useState(order.phone);
    const [city, setCity] = useState(order.city);
    const [governorate, setGovernorate] = useState(order.governorate);
    const [status, setStatus] = useState<OrderStatus>(order.status);
    const [products, setProducts] = useState(order.products);

    async function handleSave() {
        const id = order._id
        try {
            const res = await fetch(`/api/order/updateOrder/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    ...JSON_HEADER
                },
                body: JSON.stringify({
                    email, firstName, lastName, address, phone, city, governorate, status, products
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Update failed");
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    const [direction, setDirection] = useState<"ltr" | "rtl">("rtl");
    function detectDirection(text: string): "ltr" | "rtl" {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? "rtl" : "ltr";
    }

    function Input({ label, value, onChange }: InputProps) {
        return (
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">{label}</label>
                <input
                    style={{ direction }}

                    value={value}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDirection(detectDirection(val))
                        onChange(e.target.value)
                    }}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>
        );
    }

    function InputNumber({ label, value, onChange }: InputNumberProps) {
        return (
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">{label}</label>
                <input
                    style={{ direction }}

                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDirection(detectDirection(val))
                        onChange(Number(e.target.value))
                    }}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[999]">
            <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Edit Order</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input label="Email" value={email} onChange={setEmail} />
                    <Input label="First Name" value={firstName} onChange={setFirstName} />
                    <Input label="Last Name" value={lastName} onChange={setLastName} />
                    <Input label="Address" value={address} onChange={setAddress} />
                    <Input label="Phone" value={phone} onChange={setPhone} />
                    <Input label="City" value={city} onChange={setCity} />
                    <Input label="Governorate" value={governorate} onChange={setGovernorate} />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as OrderStatus)}
                            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="placed">Placed</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                <h3 className="text-lg font-semibold mb-3">Products</h3>
                <div className="space-y-4">
                    {products?.map((p, idx) => (
                        <div key={p.productId._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <p className="font-semibold mb-2">{p?.productId?.name}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <InputNumber
                                    label="Quantity"
                                    value={p.quantity}
                                    onChange={(v: number) =>
                                        setProducts(prev => prev.map((x, i) => i === idx ? { ...x, quantity: v } : x))
                                    }
                                />

                                <InputNumber
                                    label="Price"
                                    value={p.price}
                                    onChange={(v: number) =>
                                        setProducts(prev => prev.map((x, i) => i === idx ? { ...x, price: v } : x))
                                    }
                                />

                                <Input
                                    label="Color"
                                    value={p.color}
                                    onChange={(v: string) =>
                                        setProducts(prev => prev.map((x, i) => i === idx ? { ...x, color: v } : x))
                                    }
                                />
                            </div>

                            <button
                                className="mt-3 text-red-600 hover:text-red-800"
                                onClick={() =>
                                    setProducts(prev => prev.filter((_, i) => i !== idx))
                                }
                            >
                                Remove Product
                            </button>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white rounded-lg bg-buttons hover:bg-buttons-hover"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}





