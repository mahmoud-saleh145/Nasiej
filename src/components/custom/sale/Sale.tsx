'use client'
import ProductCard from "../productCard/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/common/LoadingPage";

export default function Sale() {
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            const res = await fetch(`/api/product/getSale`, {
                cache: "no-store",
            });
            const data: APIResponse<Product> = await res.json();

            if (data.msg === "success" && data.products) {
                setProducts(data.products);
                setLoading(false)
            } else { setLoading(false) }
        };
        fetchData();
    }, []);



    return (
        loading ? <LoadingPage />
            :
            <div className="">
                <h3 className="text-3xl md:text-2xl font-bold text-center  p-3
    text-red-500
    animate-pulse
    drop-shadow-[0_0_12px_rgba(255,0,0,0.7)]
">
                    🔥 Final Winter Sale 🔥
                </h3>

                <Swiper
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
                    {products.map((product, index) => (
                        <SwiperSlide key={index} className="pb-5">
                            <ProductCard key={product._id} product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
    );
}
