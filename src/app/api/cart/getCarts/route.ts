export const dynamic = "force-dynamic";

import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB()
        const carts = await cartModel
            .find({ "items.0": { $exists: true } })
            .populate("items.productId").populate({
                path: "userId",
                select: "email phone"
            });;
        return NextResponse.json({
            msg: "success",
            cart: carts,
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }
}
