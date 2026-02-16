import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import userModel from "@/lib/models/user.model";

export async function GET(req: NextRequest) {
    const userId = await getUserFromToken(req);

    if (!userId) {
        return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
    }

    const user: User = await userModel.findById(userId).populate({
        path: "orders.orderId",
        populate: {
            path: "products.productId",
            select: "-createdAt -hide -raise -discount -reserved -stock ",
        }
    });
    if (!user) {
        return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }
    if (user?.orders?.length) {
        user.orders.sort((a, b) => {
            const dateA = new Date(a.orderId?.createdAt || 0).getTime();
            const dateB = new Date(b.orderId?.createdAt || 0).getTime();
            return dateB - dateA;
        });
    }

    return NextResponse.json({
        msg: "success",
        user
    })
}