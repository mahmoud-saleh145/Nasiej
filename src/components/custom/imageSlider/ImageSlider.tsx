"use client";
import "./ImageSlider.css";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import type { Swiper as SwiperType } from "swiper";
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";

import Image from "next/image";
import { LucideZoomIn, LucideZoomOut } from "lucide-react";

const ImageSlider = forwardRef(({ variants }: { variants: Variant[] }, ref) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);


    const allImages = variants.flatMap(v =>
        v.images.map(img => ({
            ...img,
            color: v.color,
        }))
    );

    const images = variants.flatMap(v =>
        v.images.map(img => ({ ...img, color: v.color }))
    );

    const mainImages = images;

    useImperativeHandle(ref, () => ({
        slideToLoop: (index: number) => {
            if (mainSwiper) mainSwiper.slideToLoop(index);
        },
    }));

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    }, [isModalOpen]);
    return (
        <div className="w-full flex flex-col items-center">
            {/* MAIN */}
            <Swiper
                modules={[Navigation, Thumbs, Autoplay]}
                onSwiper={setMainSwiper}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                thumbs={{ swiper: thumbsSwiper }}
                loop={mainImages.length > 1}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                spaceBetween={10}
                className="w-full rounded-2xl overflow-hidden"
            >
                {mainImages.map((img, i) => (
                    <SwiperSlide key={i}>
                        <div className="relative w-full h-64 md:h-80">
                            <Image
                                src={img.url}
                                alt={`product image ${i + 1}`}
                                fill
                                onClick={() => {
                                    setModalImage(img.url);
                                    setIsModalOpen(true);
                                }}
                                className="select-none object-contain cursor-pointer"
                                sizes="(max-width: 768px) 100vw, 100vw"

                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* THUMBS */}
            <div className="w-full mt-4">
                <Swiper
                    modules={[Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    watchSlidesProgress
                    className="cursor-pointer"
                >
                    {allImages.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="w-full relative rounded-lg overflow-hidden hover:opacity-80 transition h-24">
                                <Image
                                    src={img.url}
                                    alt={`thumb ${i + 1}`}
                                    fill
                                    className="object-cover rounded-2xl select-none"
                                    sizes="(max-width: 768px) 100vw, 320px"

                                />
                                {activeIndex === i && (
                                    <div className="absolute inset-0 bg-white/40 rounded-2xl"></div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {isModalOpen && modalImage && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center mt-20">
                    <button
                        className="absolute top-4 right-4 text-white text-3xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        ✕
                    </button>

                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={3}
                        wheel={{ step: 0.1 }}
                        doubleClick={{ disabled: true }}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                {/* Controls */}
                                <div className="absolute bottom-6 flex gap-4 z-10">
                                    <button onClick={() => zoomIn()} className="px-4 py-2 text-2xl  bg-white rounded">
                                        <LucideZoomIn />

                                    </button>
                                    <button onClick={() => zoomOut()} className="px-4 py-2 text-2xl bg-white rounded">
                                        <LucideZoomOut />

                                    </button>
                                    <button onClick={() => resetTransform()} className="px-4 py-2 text-xl bg-white rounded">
                                        Reset
                                    </button>
                                </div>

                                {/* Image */}
                                <TransformComponent>
                                    <div className="relative w-[90vw] h-[80vh]">
                                        <Image
                                            src={modalImage}
                                            alt="zoomed image"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            )}


        </div>
    );
});

ImageSlider.displayName = "ImageSlider";
export default ImageSlider;
