"use client";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function AddProductModal({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    // ------- Variants -------
    const [variants, setVariants] = useState([
        { color: "", stock: 0, images: [] as VariantImage[] }
    ]);

    // new images
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [assignVariant, setAssignVariant] = useState<number[]>([]);

    useEffect(() => {
        const urls = newFiles.map(f => URL.createObjectURL(f));
        setPreviews(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [newFiles]);

    function addVariant() {
        setVariants(v => [...v, { color: "", stock: 0, images: [] }]);
    }

    function removeVariant(idx: number) {
        setVariants(prev => prev.filter((_, i) => i !== idx));
    }

    function updateVariant(idx: number, key: string, val: string | number) {
        setVariants(v => v.map((item, i) => i === idx ? { ...item, [key]: val } : item));
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...(files as File[])]);
        setAssignVariant(prev => [...prev, ...files.map(() => -1)]);
    }

    async function handleSave() {
        setLoading(true);
        setErr(null);

        try {
            const fd = new FormData();

            fd.append("name", name);
            fd.append("price", price);
            fd.append("discount", discount);
            fd.append("brand", brand);
            fd.append("category", category);
            fd.append("description", description);

            const variantsMeta = variants.map((v, variantIdx) => ({
                color: v.color,
                stock: Number(v.stock),
                fileIndexes: assignVariant
                    .map((assigned, fileIdx) => assigned === variantIdx ? fileIdx : -1)
                    .filter(idx => idx !== -1)
            }));

            fd.append("variantsMeta", JSON.stringify(variantsMeta));

            newFiles.forEach(f => fd.append("images", f));

            const res = await fetch(`/api/product/addProduct`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });

            const data: APIResponse<ProductResponse> = await res.json();

            if (data.msg === "error") {
                setErr(data.err)
            } else {
                window.location.reload();
            }

        } catch (err) {
            console.error(err);
            setErr(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);


    const [direction, setDirection] = useState<"ltr" | "rtl">("rtl");
    function detectDirection(text: string): "ltr" | "rtl" {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? "rtl" : "ltr";
    }
    return (
        <div className="fixed inset-0 edit-model bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg p-4 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Product</h2>
                    <button onClick={onClose}><IoMdClose size={25} /></button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            style={{ direction }}
                            placeholder="Name" className="border p-2 w-full"
                            value={name} onChange={(e) => {
                                const val = e.target.value;
                                setDirection(detectDirection(val));
                                setName(e.target.value)
                            }} />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Price</label>
                        <input
                            style={{ direction }}
                            placeholder="Price" className="border p-2 w-full"
                            value={price} onChange={(e) => {
                                setPrice(e.target.value)
                                const val = e.target.value;
                                setDirection(detectDirection(val));
                            }} />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Discount</label>
                        <input
                            style={{ direction }}
                            placeholder="Discount" className="border p-2 w-full"
                            value={discount} onChange={(e) => {
                                setDiscount(e.target.value)
                                const val = e.target.value;
                                setDirection(detectDirection(val));
                            }} />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Brand</label>
                        <input
                            style={{ direction }}
                            placeholder="Brand" className="border p-2 w-full"
                            value={brand} onChange={(e) => {
                                setBrand(e.target.value)
                                const val = e.target.value;
                                setDirection(detectDirection(val));
                            }} />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <input
                            style={{ direction }}
                            placeholder="Category" className="border p-2 w-full"
                            value={category} onChange={(e) => {
                                const val = e.target.value;
                                setDirection(detectDirection(val));
                                setCategory(e.target.value)
                            }} />
                    </div>

                </div>

                <div className="mt-4">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className={`border p-2 w-full`}
                        rows={3}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                            const val = e.target.value;
                            setDirection(detectDirection(val));
                        }}
                        style={{ direction }}
                    />
                </div>

                <h3 className="font-semibold text-lg mt-4 mb-2">Variants</h3>

                {variants.map((v, i) => (
                    <div key={i} className="border p-3 rounded mb-2">
                        <div className="flex gap-2 w-full">

                            <div className="w-full">
                                <label className="block mb-1 font-medium">Color</label>
                                <input type="text" value={v.color}
                                    className="border p-1 w-full"
                                    onChange={e => updateVariant(i, "color", e.target.value)}
                                    placeholder="Color" />
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-center mb-1 ">
                                    <label className="block  font-medium">Stock</label>
                                    {i > 0 ?
                                        <button onClick={() => removeVariant(i)} className="text-red-600 " title="Remove variant">Remove</button>
                                        :
                                        ""
                                    }
                                </div>
                                <input type="number" value={v.stock}
                                    className="border p-1 w-full"
                                    onChange={e => updateVariant(i, "stock", e.target.value)}
                                    placeholder="Stock" />
                            </div>

                        </div>
                    </div>
                ))}

                <button className="bg-buttons hover:bg-buttons-hover text-white px-3 py-1 rounded mt-2"
                    onClick={addVariant}>
                    + Add Variant
                </button>

                <h3 className="font-semibold mt-4">Upload Images</h3>

                <input type="file" multiple onChange={handleFileUpload} />

                {newFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previews[i]}
                            alt="photo"
                            className="w-20 h-20 object-cover rounded select-none" />

                        <div>
                            <label className="block mb-1 font-medium">Assign Variant</label>
                            <select
                                className="border p-1"
                                value={assignVariant[i]}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setAssignVariant(prev => prev.map((p, idx) => idx === i ? v : p));
                                }}
                            >
                                <option value={-1}>Choose Variant</option>
                                {variants.map((v, idx) => (
                                    <option key={idx} value={idx}>{v.color}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}

                <div className="mt-4 flex items-end justify-center flex-col">
                    <small className="text-red-600 mb-2">{err}</small>
                    <div className="flex  gap-3">

                        <button onClick={onClose} className="border px-3 py-1 rounded">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-buttons hover:bg-buttons-hover text-white px-4 py-2 rounded"
                        >
                            {loading ? "Saving..." : "Add Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
