import { connectToDB } from "@/lib/db/db";
import userModel from "@/lib/models/user.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB()
        const users = await userModel.find().populate("orders.orderId");

        return NextResponse.json({
            msg: "success",
            users: users,
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }
}
