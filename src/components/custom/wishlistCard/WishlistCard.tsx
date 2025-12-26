"use client";
import Link from "next/link";
import AddToCartButton from "@/components/common/AddToCartButton";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import type { Swiper as SwiperType } from "swiper";
import { useEmptyWishlist, useToggleWishlist, useWishlist } from "@/hooks/useWishList";
import LoadingPage from "@/components/common/LoadingPage";
import EmptyWishlist from "../emptyWIshlist/EmptyWishlist";
import { FaRegTrashCan } from "react-icons/fa6";
import ConfirmDialog from "@/components/common/ConfirmDialog";



function WishlistItem({ wish }: { wish: WishList }) {
    const variants = wish.productId.variants || [];

    const allImages = variants.flatMap(v =>
        v.images.map(img => ({
            ...img,
            color: v.color
        }))
    );

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

    const [showAllColors, setShowAllColors] = useState(false);

    const remove = useToggleWishlist();

    useEffect(() => {
        if (selectedVariant && mainSwiper) {
            const index = allImages.findIndex(img => img.color === selectedVariant.color);
            if (index !== -1) mainSwiper.slideToLoop(index, 500);
        }
    }, [selectedVariant, mainSwiper, allImages]);

    return (
        <div className={`cards-animation ${wish.productId.hide ? "hidden" : ""}`} key={wish.productId._id}>
            <div className="wish rounded py-3 p-4 shadow-2xl bg-background-light">
                <Link
                    className="link-underline link-underline-opacity-0"
                    href={`/productDetails/${wish.productId._id}`}

                >
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
                                    <div className="w-full relative h-48 ">
                                        <Image
                                            src={img.url}
                                            alt={`product image ${i + 1}`}
                                            fill
                                            className="object-contain select-none"
                                            sizes="100vw" />
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

                    <span className="fw-bold fs-5 text-text mt-3">
                        {wish.productId.discount && wish.productId.discount > wish.productId.raise ?
                            <small className="text-text-secondary me-1"><del>{wish.productId.price}</del></small>
                            :
                            wish.productId.discount && wish.productId.discount < wish.productId.raise ?
                                <small className="text-text-secondary me-1"><del>{wish.productId.price + (wish.productId.price * wish.productId.raise) / 100}</del></small>
                                : null
                        }

                        {wish.productId.discount && wish.productId.raise
                            ? wish.productId.price -
                            (wish.productId.price * wish.productId.discount) / 100 +
                            (wish.productId.price * wish.productId.raise) / 100
                            : wish.productId.raise
                                ? wish.productId.price + (wish.productId.price * wish.productId.raise) / 100
                                : wish.productId.discount
                                    ? wish.productId.price - (wish.productId.price * wish.productId.discount) / 100
                                    : wish.productId.price}{" "}
                        LE
                    </span>

                    <p className="text-black m-0">{wish.productId.name}</p>
                </Link>

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
                                            <p className="text-xs text-text-secondary truncate  w-12 text-center mb-0 mt-1">{v.color}</p>

                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                            {variants.length > 4 && (
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
                                            <p className="text-xs text-text-secondary truncate w-12 text-center mb-0 mt-1">{v.color}</p>

                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}

                <div className="row justify-between gx-3 align-items-center mt-3">
                    <AddToCartButton
                        productId={wish.productId._id}
                        selectedColor={selectedVariant?.color || ""}
                    />

                    <button
                        aria-label="Remove from wishlist"
                        className="col-2 text-danger border-0 bg-transparent p-0"
                        disabled={remove.isPending}
                        onClick={() => remove.mutate({ productId: wish.productId._id })}
                    >
                        <FaRegTrashCan className="fs-5 mx-auto" />
                    </button>
                </div>
            </div>
        </div>
    );
}


export default function WishlistCard() {
    const { data: wishlist, isLoading, isError } = useWishlist();
    const empty = useEmptyWishlist();
    if (isLoading) return <LoadingPage />;
    if (isError) return <p>Something went wrong fetching your cart.</p>;

    if (wishlist?.msg === "error") {
        return <p>Could not load wishlist.</p>;
    }
    const wish = wishlist?.wishList?.items || [];

    return (
        <div>
            {wish.length === 0 ? (
                <EmptyWishlist />
            ) : (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wish.map((item: WishList) => (
                            <WishlistItem key={item.productId._id} wish={item} />
                        ))}
                    </div>
                    <div className=" mt-5 flex justify-center ">
                        <ConfirmDialog
                            trigger={
                                <button
                                    aria-label="Empty wishlist"
                                    className={`bg-buttons text-text rounded-lg hover:bg-buttons-hover p-1.5 px-4 ${empty.isPending ? "opacity-70 " : ""
                                        }`}
                                    disabled={empty.isPending}
                                >
                                    {empty.isPending ? "Clearing..." : "Empty wishlist"}
                                </button>
                            }
                            title="Empty wishlist"
                            description="Are you sure you want to remove all items from your wishlist?"
                            confirmText="Yes, empty it"
                            cancelText="Cancel"
                            onConfirm={() => empty.mutate()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


