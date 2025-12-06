import { connectToDB } from "@/lib/db/db";
import wishListModel from "@/lib/models/wishlist.model";
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

        if (wishlist.items.length === 0)
            return NextResponse.json({ msg: "Already empty" }, { status: 200 });


        wishlist.items = [];
        await wishlist.save();
        return NextResponse.json({
            msg: "success",
            wishList: [],
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}