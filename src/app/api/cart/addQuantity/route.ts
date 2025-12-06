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
        const { productId, color } = await req.json();
        if (!sessionId && !userId) {
            return NextResponse.json({ msg: "Session or user not found" }, { status: 400 });

        }
        const product = await productModel.findById(productId);
        if (!product)
            return NextResponse.json({ msg: "No product found with this ID" }, { status: 404 })


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


        const itemIndex = cart.items.findIndex(
            (item: CartItem) => {
                const idInWishlist =
                    typeof item.productId === "string"
                        ? item.productId
                        : item.productId?._id;
                return idInWishlist.toString() === productId.toString() && item.color === color
            }
        );


        if (itemIndex === -1)
            return NextResponse.json({ msg: "Item not found in cart" }, { status: 404 })

        const itemColor = color || cart.items[itemIndex].color;
        const colorVariant = product.variants.find((v: Variant) => v.color === itemColor);

        if (!colorVariant)
            return NextResponse.json({ msg: "Selected color not found" }, { status: 404 })

        const available = colorVariant.stock - colorVariant.reserved;
        if (available < 1) {
            return NextResponse.json({ msg: "No more stock available for this product", stockLimitReached: true }, { status: 202 })

        }


        cart.items[itemIndex].quantity += 1;
        colorVariant.reserved += 1;

        await product.save();
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