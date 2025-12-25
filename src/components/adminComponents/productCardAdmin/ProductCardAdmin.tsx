"use client";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import ProductCard from "@/components/custom/productCard/ProductCard";
import EditProductModal from "../editProductModal/EditProductModal";

export default function ProductCardAdmin({ product }: { product: ProductDetails }) {
    const [openEdit, setOpenEdit] = useState(false);

    return (
        <div className="">

            <div className="cards-animation relative">
                {/* Edit button */}
                <button
                    aria-label="Edit product"
                    onClick={() => setOpenEdit(true)}
                    className="absolute top-3 right-3 bg-buttons text-white p-2 rounded-full z-20 hover:bg-buttons-hover"
                    title="Edit product"
                >
                    <FiEdit2 size={16} />
                </button>
                <ProductCard key={product._id} product={product} />

            </div>

            {openEdit && (
                <EditProductModal
                    product={product}
                    onClose={() => setOpenEdit(false)}
                />
            )}
        </div>

    );
}
