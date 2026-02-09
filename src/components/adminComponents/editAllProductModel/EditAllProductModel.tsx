"use client";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function EditAllProductModel({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [raise, setRaise] = useState("");

    const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

    function detectDirection(text: string): "ltr" | "rtl" {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? "rtl" : "ltr";
    }

    const handleSave = async () => {
        setErr(null);

        const priceVal = price !== "" ? Number(price) : undefined;
        const discountVal = discount !== "" ? Number(discount) : undefined;
        const raiseVal = raise !== "" ? Number(raise) : undefined;

        if (
            [priceVal, discountVal, raiseVal].some(
                v => v !== undefined && isNaN(v)
            )
        ) {
            setErr("Please enter valid numbers");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/product/updateAllProducts", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceChange: priceVal,
                    discountChange: discountVal,
                    raiseChange: raiseVal,
                }),
            });

            const data = await res.json();

            if (data.msg === "success") {
                window.location.reload();
            } else {
                setErr(data.msg || "Something went wrong");
            }

        } catch (error) {
            console.error(error);
            setErr("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 edit-model bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-3xl rounded-lg p-4 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit All Products</h2>
                    <button aria-label="close-addModel" onClick={onClose}>
                        <IoMdClose size={25} />
                    </button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Increase Price (fixed)</label>
                        <input
                            style={{ direction }}
                            placeholder="Increase Price" className="border p-2 w-full"
                            value={price} onChange={(e) => {
                                setPrice(e.target.value);
                                setDirection(detectDirection(e.target.value));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Discount %</label>
                        <input
                            style={{ direction }}
                            placeholder="Discount %" className="border p-2 w-full"
                            value={discount} onChange={(e) => {
                                setDiscount(e.target.value);
                                setDirection(detectDirection(e.target.value));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Raise %</label>
                        <input
                            style={{ direction }}
                            placeholder="Raise %" className="border p-2 w-full"
                            value={raise} onChange={(e) => {
                                setRaise(e.target.value);
                                setDirection(detectDirection(e.target.value));
                            }}
                        />
                    </div>
                </div>

                {/* Errors & Buttons */}
                <div className="mt-4 flex flex-col items-center">
                    {err && <small className="text-red-600 mb-2">{err}</small>}
                    <div className="flex gap-3">
                        <button
                            aria-label="cancel-edit"
                            onClick={onClose}
                            className="border px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            aria-label="save-edit"
                            onClick={handleSave}
                            className="bg-buttons hover:bg-buttons-hover text-white px-4 py-2 rounded"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
