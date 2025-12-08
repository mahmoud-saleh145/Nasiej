"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function EditProductModal({
    product,
    onClose,
}: {
    product: ProductDetails;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);


    const [name, setName] = useState(product.name || "");
    const [price, setPrice] = useState(`${product.price}` || "0");
    const [discount, setDiscount] = useState(`${product.discount}` || "0");
    const [raise, setRaise] = useState(`${product.raise}` || "0");
    const [hide, setHide] = useState(product.hide ?? false);
    const [brand, setBrand] = useState(product.brand || "");
    const [category, setCategory] = useState(product.category || "");
    const [description, setDescription] = useState(product.description || "");

    // ------------------- Variants -------------------
    const [variants, setVariants] = useState(
        product.variants.map(v => ({
            color: v.color,
            stock: v.stock,
            reserved: v.reserved,
            images: v.images.map(img => ({ ...img, keep: true })),
        }))
    );

    // ------------------- New files -------------------
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [newFilesVariant, setNewFilesVariant] = useState<number[]>([]);

    useEffect(() => {
        const urls = newFiles.map(file => URL.createObjectURL(file));
        setNewPreviews(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [newFiles]);

    // ------------------- Variant helpers -------------------
    function addVariant() {
        setVariants(prev => [...prev, { color: "", stock: 0, reserved: 0, images: [] }]);
    }

    function removeVariant(idx: number) {
        setVariants(prev => prev.filter((_, i) => i !== idx));
    }

    function updateVariant(
        idx: number,
        key: keyof Omit<Variant, "images">,
        value: string
    ) {
        setVariants(prev =>
            prev.map((v, i) => {
                if (i !== idx) return v;

                switch (key) {
                    case "stock":
                    case "reserved":
                        return { ...v, [key]: Number(value) };

                    case "color":
                        return { ...v, color: value };

                    default:
                        return v;
                }
            })
        );
    }



    function toggleKeepOldImage(variantIdx: number, imgIdx: number) {
        setVariants(prev =>
            prev.map((v, i) =>
                i === variantIdx
                    ? {
                        ...v,
                        images: v.images.map((img, j) =>
                            j === imgIdx ? { ...img, keep: !img.keep } : img
                        ),
                    }
                    : v
            )
        );
    }

    function removeNewFile(idx: number) {
        setNewFiles(prev => prev.filter((_, i) => i !== idx));
        setNewFilesVariant(prev => prev.filter((_, i) => i !== idx));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setNewFiles(prev => [...prev, ...files]);
        setNewFilesVariant(prev => [...prev, ...files.map(() => -1)]);
        e.currentTarget.value = "";
    }

    // ------------------- Submit -------------------
    async function handleSave() {
        setErr(null);
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("id", product._id);
            fd.append("name", name);
            fd.append("price", price);
            fd.append("discount", discount);
            fd.append("raise", raise);
            fd.append("hide", hide ? "true" : "false");
            fd.append("brand", brand);
            fd.append("category", category);
            fd.append("description", description);

            const variantsMeta = variants.map((v, variantIdx) => {
                const fileIndexes = newFilesVariant
                    .map((assignedVariantIdx, fileIdx) =>
                        assignedVariantIdx === variantIdx ? fileIdx : -1
                    )
                    .filter(idx => idx !== -1);

                return {
                    color: v.color,
                    stock: Number(v.stock),
                    reserved: Number(v.reserved),
                    keepOldImages: v.images?.filter(img => img.keep).map(img => img.url) || [],
                    fileIndexes,
                };
            });

            fd.append("variantsMeta", JSON.stringify(variantsMeta));

            // Append new files
            newFiles.forEach(file => fd.append("files", file, file.name));

            const res = await fetch(`/api/product/updateProduct`, {
                method: "PATCH",
                body: fd,
                credentials: "include",
            });

            const data: APIResponse<ProductResponse> = await res.json();
            if (!res.ok) throw new Error(data?.msg || "Update failed");

            window.location.reload();
            onClose();
        } catch (err) {
            console.error("update product error:", err);
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


    return (
        <div className="fixed inset-0 bg-black/40 edit-model flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl p-4 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4">
                    <h3 className="text-xl font-semibold m-0">Edit Product</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded">
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-base font-medium">Name</span>
                            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className="flex-1 block">
                                <span className="text-base font-medium">Price</span>
                                <input type="number" lang="en" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                            </label>
                            <label className="w-full sm:w-28 block">
                                <span className="text-base font-medium">Discount %</span>
                                <input type="number" lang="en" value={discount} onChange={e => setDiscount(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                            </label>
                            <label className="w-full sm:w-28 block">
                                <span className="text-base font-medium">Raise %</span>
                                <input type="number" lang="en" value={raise} onChange={e => setRaise(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-base font-medium">Brand</span>
                            <input value={brand} onChange={e => setBrand(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                        </label>

                        <label className="block">
                            <span className="text-base font-medium">Category</span>
                            <input value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border rounded p-3 text-base" />
                        </label>

                        <label className="block">
                            <span className="text-base font-medium">Description</span>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border rounded p-3 text-base" />
                        </label>

                        <label className="flex items-center gap-2 text-base">
                            <input type="checkbox" checked={hide} onChange={e => setHide(e.target.checked)} />
                            Hide product
                        </label>
                    </div>

                    {/* Right side: Variants & images */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-medium">Variants & Images</h4>
                                <button onClick={addVariant} type="button" className="bg-buttons hover:bg-buttons-hover text-white px-3 py-1 rounded text-sm">Add Variant</button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                {variants.map((v, idx) => (
                                    <div key={idx} className="border p-2 rounded bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <input type="text" value={v.color} onChange={e => updateVariant(idx, "color", e.target.value)} className="border rounded p-1 text-sm w-28" placeholder="Color" />
                                            <input type="number" value={v.stock} onChange={e => updateVariant(idx, "stock", e.target.value)} className="border rounded p-1 text-sm w-20" placeholder="Stock" />
                                            <input type="number" value={v.reserved} onChange={e => updateVariant(idx, "reserved", e.target.value)} className="border rounded p-1 text-sm w-20" placeholder="Reserved" />
                                            <button onClick={() => removeVariant(idx)} className="text-red-600 p-1" title="Remove variant">Remove</button>
                                        </div>

                                        {/* Existing images */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {v.images.map((img, i) => (
                                                <div key={i} className="w-28 h-28 relative">
                                                    <Image
                                                        src={img.url}
                                                        alt={v.color}
                                                        fill
                                                        className="rounded mr-3 object-cover select-none"
                                                        sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 112px"

                                                    />
                                                    <label className="absolute top-0 left-0 bg-white px-1 text-xs">
                                                        <input type="checkbox" checked={img.keep} onChange={() => toggleKeepOldImage(idx, i)} /> Keep
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {/* New files selection per variant */}
                                        <div className="flex flex-col gap-2">
                                            {newFiles.map((file, i) => variants[newFilesVariant[i]]?.color === v.color && (
                                                <div key={i} className="flex items-center gap-2">
                                                    <img
                                                        src={newPreviews[i]}
                                                        alt="New files selection per variant"

                                                        className="object-cover rounded w-20 h-20 select-none"
                                                    />
                                                    <button onClick={() => removeNewFile(i)} className="text-red-600">Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Upload new files */}
                                <div className="mt-3">
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                                    <p className="text-sm text-gray-500">After uploading, assign each image to a variant below.</p>

                                    {newFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 mt-2">
                                            <img
                                                alt="Upload new files"
                                                src={newPreviews[i]}
                                                className="object-cover rounded w-20 h-20 select-none"
                                            />
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={newFilesVariant[i]}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setNewFilesVariant(prev => prev.map((p, idx) => idx === i ? val : p));
                                                    }}
                                                    className="border rounded p-1"
                                                >
                                                    <option value={-1}>Unassigned</option>
                                                    {variants.map((v, idx) => (
                                                        <option key={idx} value={idx}>
                                                            {v.color || `Variant ${idx + 1}`}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // remove file i
                                                        setNewFiles(prev => prev.filter((_, idx) => idx !== i));
                                                        setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
                                                        setNewFilesVariant(prev => prev.filter((_, idx) => idx !== i));
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 p-4 border-t mt-4">
                    <div className="text-red-600">{err}</div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                        <button onClick={handleSave} className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-buttons hover:bg-buttons-hover text-white"}`} disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
