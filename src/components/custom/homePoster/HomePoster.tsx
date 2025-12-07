'use client'

import Image from "next/image";
import img from "../../../../public/main-name.png"

export default function HomePoster() {
    return (
        <div className="relative flex items-center justify-center min-h-[200px] md:min-h-[400px] lg:min-h-[600px] w-full">

            <div className=" w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/poster.png"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    alt="Poster"
                />
                <video
                    className="w-full relative z-20"
                    autoPlay
                    muted
                    preload="auto"
                    playsInline
                    onCanPlay={() => {
                        document.querySelector('img')!.style.display = 'none';
                    }}
                >
                    <source src="/video.mp4" type="video/mp4" />
                </video>
            </div>
            <div className=" absolute w-1/2 h-1/2 lg:h-1/3 logo-text z-30 ">
                <Image
                    src={img}
                    alt="Nasieچ Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority

                />
            </div>
        </div>
    )
}