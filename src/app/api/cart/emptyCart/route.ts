import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";
import productModel from "@/lib/models/product.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
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

        if (!cart)
            return NextResponse.json({ msg: "Cart not found" }, { status: 404 })


        for (const item of cart.items) {
            const product = await productModel.findById(item.productId);
            if (!product) continue;

            const colorVariant = product.variants.find((c: Variant) => c.color === item.color);
            if (colorVariant) {
                colorVariant.reserved -= item.quantity;
                if (colorVariant.reserved < 0) colorVariant.reserved = 0;
                await product.save();
            }
        }

        cart.items = [];
        await cart.save();

        return NextResponse.json({
            msg: "success",
            cart
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}