import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import cartModel from "@/lib/models/cart.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const result = await cartModel.deleteMany({ items: { $size: 0 } });

        return NextResponse.json({
            msg: "Empty carts deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}
