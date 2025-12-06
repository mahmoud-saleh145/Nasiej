import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB()
        const carts = await cartModel.find().populate("items.productId");

        return NextResponse.json({
            msg: "success",
            cart: carts,
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }
}
