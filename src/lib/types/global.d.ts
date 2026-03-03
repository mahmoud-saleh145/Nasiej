declare global {
    interface Window {
        fbq?: (
            action: "track" | "init",
            event: string,
            params?: Record<string, unknown>
        ) => void;
    }
    // eslint-disable-next-line no-var
    var mongoose:
        | {
            conn: typeof mongoose | null;
            promise: Promise<typeof mongoose> | null;
        }
        | undefined;

}

export { };