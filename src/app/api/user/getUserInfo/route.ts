import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import userModel from "@/lib/models/user.model";

export async function GET(req: NextRequest) {
    const userId = await getUserFromToken(req);

    if (!userId) {
        return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
    }

    const user = await userModel.findById(userId).populate({
        path: "orders.orderId",
        populate: {
            path: "products.productId",
            select: "-createdAt -hide -raise -discount -reserved -stock ",
        }
    });
    if (!user) {
        return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }

    return NextResponse.json({
        msg: "success",
        user
    })
}