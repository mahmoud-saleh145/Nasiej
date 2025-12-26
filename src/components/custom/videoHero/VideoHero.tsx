type Props = {
    poster?: string;
};

export default function VideoHero({ poster = "/poster.png" }: Props) {

    return (
        <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={poster}
            controls={false}

        >
            <source src="/video.mp4" type="video/mp4" />
        </video>
    );
}
