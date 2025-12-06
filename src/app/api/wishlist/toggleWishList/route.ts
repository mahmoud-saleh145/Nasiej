import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";
import wishListModel from "@/lib/models/wishlist.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const sessionId = req.cookies.get("sessionId")?.value;
        const userId = await getUserFromToken(req);
        const { productId } = await req.json();
        if (!sessionId && !userId) {
            return NextResponse.json({ msg: "Session or user not found" }, { status: 400 });
        }
        const product = await productModel.findById(productId);
        if (!product)
            return NextResponse.json({ msg: "No product found with this ID" }, { status: 404 });
        let wishlist
        if (userId) {
            wishlist = await wishListModel
                .findOne({ userId })
                .populate("items.productId");
        } else if (sessionId) {
            wishlist = await wishListModel
                .findOne({ sessionId })
                .populate("items.productId");
        }

        if (!wishlist) {
            wishlist = new wishListModel({
                sessionId: sessionId || undefined,
                userId: userId || null,
                items: [],
            });
        }

        const itemIndex = wishlist.items.findIndex((item: WishList) => {

            const idInWishlist =
                typeof item.productId === "string"
                    ? item.productId
                    : item.productId?._id;

            return idInWishlist?.toString() === productId.toString();
        });
        let msg;
        let added;
        if (itemIndex === -1) {
            wishlist.items.push({ productId });
            msg = "Item added to wishlist";
            added = true;
        } else {
            wishlist.items.splice(itemIndex, 1);
            msg = "Item removed from wishlist";
            added = false;
        }

        await wishlist.save();

        return NextResponse.json({
            msg,
            added,
            wishList: wishlist,
        });


    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}