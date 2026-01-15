export { };

declare global {
    interface Window {
        fbq?: (
            action: "track" | "init",
            event: string,
            params?: Record<string, unknown>
        ) => void;
    }
}
