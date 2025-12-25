"use client";
import Link from "next/link";
import AddToCartButton from "@/components/common/AddToCartButton";
import AddToWishListButton from "@/components/common/AddToWishListButton";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import type { Swiper as SwiperType } from "swiper";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/hooks/useAuth";
import { useAutoDirection } from "@/hooks/useAutoDirection";

export default function ProductCard({ product }: { product: ProductDetails }) {
    const role = useAuth((state) => state.role);

    const variants = product.variants || [];
    const allImages = variants.flatMap(v =>
        v.images.map(img => ({
            ...img,
            color: v.color
        }))
    );
    const [showAllColors, setShowAllColors] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);


    useEffect(() => {
        if (selectedVariant && mainSwiper) {
            const index = allImages.findIndex(img => img.color === selectedVariant.color);
            if (index !== -1) mainSwiper.slideToLoop(index, 500);
        }
    }, [selectedVariant, mainSwiper]);


    return (
        <div className={`cards-animation ${product.hide && role === "admin" ? "opacity-50" : product.hide ? "hidden" : ""}`} key={product._id}>
            <div className="product rounded-xl py-3 p-3 shadow-xl bg-background-light">

                {/* LINK */}
                <Link
                    className="link-underline link-underline-opacity-0"
                    href={`/productDetails/${product._id}`}
                >

                    {/* ---------- PRODUCT IMAGES ---------- */}
                    <Swiper
                        modules={[Thumbs, Autoplay]}
                        onSwiper={setMainSwiper}
                        spaceBetween={10}
                        loop={allImages.length > 1}
                        autoplay={{ delay: 3000, disableOnInteraction: true }}
                        className="w-full "
                    >

                        {allImages.length > 0 ? (
                            allImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <div className="w-full relative h-40 ">
                                        <Image
                                            src={img.url}
                                            alt={`product image ${i + 1}`}
                                            fill
                                            className="object-contain select-none"
                                            sizes="(max-width: 768px) 100vw, 320px"
                                            priority

                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No images available
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>

                    {/* ---------- PRICE + NAME ---------- */}
                    <span className="fw-bold fs-5 text-text mt-3">

                        {product.discount && product.discount > product.raise ? (
                            <small className="text-text-secondary me-1"><del>{product.price}</del></small>
                        ) : product.raise && product.discount && product.discount < product.raise ? (
                            <small className="text-text-secondary me-1">
                                <del>{product.price + (product.price * product.raise) / 100}</del>
                            </small>
                        ) : ''}

                        {product.discount && product.raise
                            ? product.price -
                            (product.price * product.discount) / 100 +
                            (product.price * product.raise) / 100
                            : product.raise
                                ? product.price + (product.price * product.raise) / 100
                                : product.discount
                                    ? product.price - (product.price * product.discount) / 100
                                    : product.price}{" "}
                        LE
                    </span>

                    <p dir={useAutoDirection(product.name ?? "")} className="text-text m-0 truncate w-full ">{product.name}</p>
                </Link>

                {/* ---------- VARIANTS (COLORS) ---------- */}

                {!showAllColors ? (
                    <div className="w-full ">
                        <Swiper
                            modules={[Thumbs]}
                            spaceBetween={5}
                            slidesPerView={4}
                            className="cursor-pointer pt-2 ps-1 "
                        >
                            {variants.slice(0, 3).map((v, index) => {
                                const outOfStock = v.stock <= v.reserved || v.stock === 0;
                                const isSelected = selectedVariant?.color === v.color;

                                return (
                                    <SwiperSlide key={index} className="">
                                        <div className=" p-1 flex flex-col items-center justify-center" key={index}>
                                            <button
                                                aria-label={`Select color ${v.color}`}
                                                onClick={() => !outOfStock && setSelectedVariant(v)}
                                                disabled={outOfStock}
                                                className={`relative border w-6 h-6 rounded-full ${isSelected ? "border-blue-600 ring-2 ring-blue-400" : ""}`}
                                            >
                                                <span
                                                    className="absolute inset-0 rounded-full"
                                                    style={{
                                                        backgroundColor: v.color,
                                                        opacity: outOfStock ? 0.4 : 1,
                                                    }}
                                                />

                                                {outOfStock && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-red-700 font-bold text-4xl">
                                                        <IoMdClose />
                                                    </span>
                                                )}
                                            </button>
                                            <p className="text-xs text-text-secondary truncate  w-12 text-center mb-0 mt-1 px-2.5">{v.color}</p>

                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                            {variants.length > 3 && (
                                <SwiperSlide>
                                    <div className="p-1 flex flex-col items-center justify-center">
                                        <button
                                            aria-label="Show all colors"
                                            onClick={() => setShowAllColors(true)}
                                            className="w-6 h-6 border rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold"
                                        >
                                            +{variants.length - 3}
                                        </button>
                                        <p className="text-xs text-text-secondary mb-0 mt-1">more</p>
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>

                    </div>
                ) : (
                    <div className="w-full ">
                        <Swiper
                            modules={[Thumbs]}
                            spaceBetween={10}
                            slidesPerView={4}
                            className="cursor-pointer pt-2 ps-1 "
                        >
                            {variants.map((v, i) => {
                                const outOfStock = v.stock <= v.reserved || v.stock === 0;
                                const isSelected = selectedVariant?.color === v.color;

                                return (
                                    <SwiperSlide key={i} className="">
                                        <div className="p-1 flex flex-col items-center justify-center">

                                            <button
                                                aria-label={`Select color ${v.color}`}
                                                onClick={() => !outOfStock && setSelectedVariant(v)}
                                                disabled={outOfStock}
                                                className={`relative border w-6 h-6 rounded-full ${isSelected ? "ring-2 ring-blue-400" : ""}`}
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
                                            <p className="text-xs text-text-secondary truncate w-12 text-center mb-0 mt-1 px-2.5">{v.color}</p>

                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}

                {/* ---------- ADD TO CART / WISHLIST ---------- */}
                <div className="row justify-between gx-3 align-items-center mt-3">
                    <AddToCartButton
                        productId={product._id}
                        selectedColor={selectedVariant?.color || ""}
                    />

                    <AddToWishListButton
                        productId={product._id}
                    />
                </div>
            </div>
        </div>
    );
}
