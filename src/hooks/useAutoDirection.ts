import { useMemo } from "react";

export type TextDirection = "ltr" | "rtl";

export function detectDirection(text: string): TextDirection {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? "rtl" : "ltr";
}

export function useAutoDirection(text: string): TextDirection {
    const direction = useMemo(() => {
        return detectDirection(text);
    }, [text]);

    return direction;
}
