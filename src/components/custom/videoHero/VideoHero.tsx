"use client";

import { useEffect, useRef } from "react";

type Props = {
    poster?: string;
};

export default function VideoHero({ poster = "/poster.png" }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;
        video.play().catch(() => { });
    }, []);

    return (
        <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            poster={poster}
        >
            <source src="/video.mp4" type="video/mp4" />
        </video>
    );
}
