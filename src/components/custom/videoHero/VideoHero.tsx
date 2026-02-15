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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.currentTime = 0;
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            {
                threshold: 0,
            }
        );
        observer.observe(video);
        return () => {
            observer.disconnect();
        };
    }, []);
    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={poster}
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"

        >
            <source src="/video.mp4" type="video/mp4" />
        </video>
    );
}
