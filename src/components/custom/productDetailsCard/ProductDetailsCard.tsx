"use client";

import AddToCartButton from "@/components/common/AddToCartButton";
import AddToWishListButton from "@/components/common/AddToWishListButton";
import ImageSlider from "../imageSlider/ImageSlider";
import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import type { Swiper as SwiperType } from "swiper";

export default function ProductDetailsCard({
    details,
    variants,

}: {
    details: ProductDetails;
    variants: Variant[];

}) {


    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const sliderRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        if (!selectedVariant || !sliderRef.current) return;
        const startIndex = variants
            .slice(0, variants.findIndex(v => v.color === selectedVariant.color))
            .reduce((acc, v) => acc + v.images.length, 0);

        sliderRef.current.slideToLoop(startIndex);
    }, [selectedVariant, variants]);

    const handleColorClick = (variant: Variant) => {
        setSelectedVariant(variant);
    };

    return (
        <div className="row align-items-center p-3">

            {/* 🖼️ SLIDER */}
            <div className="col-md-5 mb-5">
                <ImageSlider ref={sliderRef} variants={variants} />
            </div>

            {/* 🧾 DETAILS */}
            <div className="col-md-7">
                <div className="flex justify-between items-center">
                    <div className="">
                        <span className="fw-bold fs-5 text-text mt-1">
                            {details.discount && details.discount > details.raise ? (
                                <small className="text-text-secondary me-1">
                                    <del>{details.price}</del>
                                </small>
                            ) : details.discount && details.discount < details.raise ? (
                                <small className="text-text-secondary me-1">
                                    <del>{details.price + (details.price * details.raise) / 100}</del>
                                </small>
                            ) : (
                                ""
                            )}

                            {details.discount && details.raise
                                ? details.price -
                                (details.price * details.discount) / 100 +
                                (details.price * details.raise) / 100
                                : details.raise
                                    ? details.price + (details.price * details.raise) / 100
                                    : details.discount
                                        ? details.price - (details.price * details.discount) / 100
                                        : details.price}
                            LE
                        </span>

                        <h4 className="mb-3 text-text fw-bold">{details?.name}</h4>
                    </div>

                    <div className="align-self-start">
                        <p className="text-text text-sm m-0">
                            category: <strong>{details?.category}</strong>
                        </p>
                        <p className="text-text text-sm m-0">
                            brand: <strong>{details?.brand}</strong>
                        </p>
                    </div>
                </div>

                <p className="text-text">{details?.description}</p>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {variants.map((v, index) => {
                        const outOfStock = v.stock <= v.reserved || v.stock === 0;
                        const isSelected = selectedVariant?.color === v.color;

                        return (
                            <div className="flex flex-col items-center" key={index}>
                                <button
                                    onClick={() => !outOfStock && handleColorClick(v)}
                                    disabled={outOfStock}
                                    className={`relative w-6 h-6 rounded-full ${isSelected ? "border-blue-600 ring-2 ring-blue-400" : ""
                                        }`}
                                >
                                    <span
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            backgroundColor: v.color,
                                            opacity: outOfStock ? 0.4 : 1,
                                        }}
                                    />

                                    {outOfStock && (
                                        <span className="absolute inset-0 flex items-center justify-center text-red-700 font-bold text-3xl">
                                            <IoMdClose />
                                        </span>
                                    )}
                                </button>

                                <p className="mb-0 text-gray-600">{v.color}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="row justify-between gx-3 align-items-center mt-3">
                    <AddToCartButton
                        productId={details?._id || ""}
                        selectedColor={selectedVariant?.color || ""}
                    />

                    <AddToWishListButton
                        productId={details?._id || ""}
                    />
                </div>
            </div>
        </div>
    );
}
