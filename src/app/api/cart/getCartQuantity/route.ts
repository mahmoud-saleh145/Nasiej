import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDB()
        const sessionId = req.cookies.get("sessionId")?.value;
        const userId = await getUserFromToken(req);
        if (!sessionId && !userId) {
            return NextResponse.json({ msg: "Session or user not found" }, { status: 400 });
        }

        let cart
        if (userId) {
            cart = await cartModel
                .findOne({ userId })
                .populate("items.productId");
        } else if (sessionId) {
            cart = await cartModel
                .findOne({ sessionId })
                .populate("items.productId");
        }


        if (!cart && sessionId)
            cart = await cartModel.create({ sessionId, items: [] });


        const totalQuantity = cart.items.reduce(
            (acc: number, item: CartItem) => acc + item.quantity,
            0
        );

        return NextResponse.json({
            totalQuantity
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}