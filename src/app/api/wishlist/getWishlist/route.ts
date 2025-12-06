import { connectToDB } from "@/lib/db/db";
import wishListModel from "@/lib/models/wishlist.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
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


        return NextResponse.json({
            msg: "success",
            wishList: wishlist ? wishlist : [],
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }

}