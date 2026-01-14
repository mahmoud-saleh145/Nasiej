"use client";
import AddToCartButton from "@/components/common/AddToCartButton";
import AddToWishListButton from "@/components/common/AddToWishListButton";
import ImageSlider from "../imageSlider/ImageSlider";
import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import type { Swiper as SwiperType } from "swiper";
import { useAutoDirection } from "@/hooks/useAutoDirection";
import { FaMinus, FaPlus } from "react-icons/fa";
import TermsAccordion from "../polices/TermsAccordion";
export default function ProductDetailsCard({
    details,
    variants,

}: {
    details: ProductDetails;
    variants: Variant[];

}) {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    // eslint-disable-next-line prefer-const
    let [quantity, setQuantity] = useState<number>(1)
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

    async function increase() {
        setQuantity(quantity += 1)
    }
    async function decrease() {
        if (quantity > 1) {
            setQuantity(quantity -= 1)
        }
    }
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
                        <span className="fw-bold text-2xl text-text ">
                            {details.discount && details.discount > details.raise ? (
                                <small className="text-text-secondary me-1 ">
                                    <del>{details.price}</del>
                                </small>
                            ) : details.discount && details.discount < details.raise ? (
                                <small className="text-text-secondary me-1">
                                    <del>{details.price + (details.price * details.raise) / 100}</del>
                                </small>
                            ) : (
                                ""
                            )}
                            {details.finalPrice ?? details.price} LE

                        </span>

                        <div className="mt-2">
                            <p className="text-text text-sm m-0">
                                category: <strong>{details?.category}</strong>
                            </p>
                            <p className="text-text text-sm m-0">
                                brand: <strong>{details?.brand}</strong>
                            </p>
                        </div>
                    </div>
                    <h4 className="m-0 text-text fw-bold align-self-start" dir={useAutoDirection(details?.name ?? "")}>{details?.name}</h4>

                </div>

                <p dir={useAutoDirection(details?.description ?? "")} className="text-text whitespace-pre-line my-3">{details?.description}</p>

                <div className="flex items-center gap-3 mt-2 flex-wrap mb-4">
                    {variants.map((v, index) => {
                        const outOfStock = v.stock <= v.reserved || v.stock === 0;
                        const isSelected = selectedVariant?.color === v.color;

                        return (
                            <div className="flex flex-col items-center" key={index}>
                                <button
                                    aria-label={`Select color ${v.color}`}
                                    onClick={() => !outOfStock && handleColorClick(v)}
                                    disabled={outOfStock}
                                    className={`relative w-6 h-6 border rounded-full ${isSelected ? "border-blue-600 ring-2 ring-blue-400" : ""
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
                <div className="grid grid-cols-12">

                    <div className="col-span-10 flex justify-between items-center p-2 text-text">
                        <button aria-label="Decrease quantity" className=" hover:text-text-secondary hover:scale-[1.1]" disabled={quantity === 1} onClick={decrease} >
                            <FaMinus />
                        </button>
                        <h6 className="m-0 ">{quantity}</h6>
                        <button
                            aria-label="Increase quantity"
                            className=" hover:text-text-secondary hover:scale-[1.1]" onClick={increase} disabled={variants === null || quantity === variants[0].stock} >

                            <FaPlus />
                        </button>

                    </div>
                </div>
                <div className="row justify-between gx-3 align-items-center mt-2">
                    <AddToCartButton
                        productId={details?._id || ""}
                        selectedColor={selectedVariant?.color || ""}
                        quantity={quantity || 1}
                    />

                    <AddToWishListButton
                        productId={details?._id || ""}
                    />
                </div>
            </div>
            {/* 📝 TERMS AND POLICIES */}
            <TermsAccordion />
        </div>
    );
}
