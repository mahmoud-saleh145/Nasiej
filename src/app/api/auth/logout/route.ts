import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = cookies();
    cookieStore.set({
        name: "token",
        value: "",
        expires: new Date(0),
        path: "/",
    });

    return NextResponse.json({ msg: "Logged out" });
}
