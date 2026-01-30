"use client";

import { useAutoDirection } from "@/hooks/useAutoDirection";

export default function AutoText({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const dir = useAutoDirection(text);

    return (
        <span dir={dir} className={className} style={{ unicodeBidi: "plaintext" }}>
            {text}
        </span>
    );
}
