export async function verifyJWT(token: string, secret: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
    );

    const [header, payload, signature] = token.split(".");

    const data = `${header}.${payload}`;
    const signatureBuffer = Uint8Array.from(
        atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBuffer,
        new TextEncoder().encode(data)
    );

    if (!isValid) return null;

    const decodedJSON = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedJSON;
}
