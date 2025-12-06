import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";
import productModel from "@/lib/models/product.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const sessionId = req.cookies.get("sessionId")?.value;
        const userId = await getUserFromToken(req);
        const { productId, color, quantity = 1 } = await req.json();
        if (!sessionId && !userId) {
            return NextResponse.json({ msg: "Session or user not found" }, { status: 400 });

        }
        const product = await productModel.findById(productId);
        if (!product)
            return NextResponse.json({ msg: "No product found with this ID" }, { status: 404 })
        const colorVariant = product.variants.find((v: Variant) => v.color === color); if (!colorVariant)

            if (colorVariant.stock === colorVariant.reserved) {
                return NextResponse.json({ msg: "No more stock available for this product", stockLimitReached: true }, { status: 202 })
            }

        const available = colorVariant.stock - colorVariant.reserved;
        if (available < quantity) {
            return NextResponse.json({ msg: "No more stock available for this product", stockLimitReached: true }, { status: 202 })

        }

        let cart
        if (userId) {
            cart = await cartModel
                .findOne({ userId: userId._id })
                .populate("items.productId");
        } else if (sessionId) {
            cart = await cartModel
                .findOne({ sessionId })
                .populate("items.productId");
        }


        if (!cart) {
            cart = new cartModel({
                userId: userId || undefined,
                sessionId: sessionId || undefined,
                items: [],
            });
        }

        const itemIndex = cart.items.findIndex(
            (item: CartItem) => {
                const idInWishlist =
                    typeof item.productId === "string"
                        ? item.productId
                        : item.productId?._id;
                return idInWishlist.toString() === productId.toString() && item.color === color
            }
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, color });
        }

        colorVariant.reserved += quantity;
        await cart.save();
        await product.save();
        return NextResponse.json({
            msg: "success",
            cart
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}