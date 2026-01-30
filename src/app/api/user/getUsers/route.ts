export const dynamic = "force-dynamic";

import { connectToDB } from "@/lib/db/db";
import userModel from "@/lib/models/user.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB()
        const users = await userModel.find({ role: "user" }).populate("orders.orderId");

        return NextResponse.json({
            msg: "success",
            user: users,
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }
}
