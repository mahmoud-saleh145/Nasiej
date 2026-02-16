'use client'
export const dynamic = "force-dynamic";

import ProductCard from "../productCard/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/common/LoadingPage";

export default function Sale() {
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/product/getSale`, {
                    cache: "no-store",
                });

                const data = await res.json();
                if (data.msg === "success") {
                    setProducts(data.products);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    return (
        loading ? <LoadingPage />
            :
            products.length === 0 ?
                ""
                :
                <div className="">
                    <h3 className="text-2xl md:text-2xl font-bold text-center  p-3
    text-red-500
    animate-pulse
    drop-shadow-[0_0_12px_rgba(255,0,0,0.7)]
">
                        🔥 Final Winter Sale 20% 🔥
                    </h3>

                    <Swiper
                        modules={[Autoplay, FreeMode]}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: true,
                            pauseOnMouseEnter: true,
                        }}
                        speed={1000}
                        freeMode={{
                            enabled: true,
                            momentum: true,
                            momentumRatio: 0.5,
                            momentumBounce: false,
                        }}
                        slidesPerView={2.1}
                        slidesPerGroup={1}
                        resistanceRatio={0}
                        touchRatio={1.2}
                        breakpoints={{
                            768: { slidesPerView: 3.1 },
                            1280: { slidesPerView: 4.1 },
                        }}
                        loop
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id} className="pb-5">
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    {/* <Swiper
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: true,
                            pauseOnMouseEnter: true
                        }}
                        slidesPerView={2.2}
                        breakpoints={{
                            768: {
                                slidesPerView: 3.2,
                            },
                            1280: {
                                slidesPerView: 4.2,
                            },
                        }}
                        loop
                        className=""
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id} className="pb-5">
                                <ProductCard key={product._id} product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper> */}
                </div>
    );
}
