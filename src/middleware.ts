import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/utils/verifyJwt";
import { v4 as uuidv4 } from "uuid";

const userPages = ["/profile"];
const adminPages = ["/admin", "/admin/orders"];

export default async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const token = request.cookies.get("token")?.value;
    const sessionId = request.cookies.get("sessionId")?.value;



    if (!token && !sessionId) {
        const newSession = uuidv4();

        response.cookies.set({
            name: "sessionId",
            value: newSession,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // console.log("🟢 Created new sessionId:", newSession);
    } else {
        // console.log("✅ Existing sessionId:", sessionId);
    }

    const url = request.nextUrl.pathname;
    if (!token) {
        if (userPages.includes(url) || adminPages.includes(url)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return response;
    }

    try {
        const decoded: TokenPayload = await verifyJWT(token, process.env.JWT_SECRET!);

        if (!decoded) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (adminPages.includes(url) && decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return response;
    } catch (err) {
        console.log(err);
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
