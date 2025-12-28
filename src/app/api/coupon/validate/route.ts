import { connectToDB } from "@/lib/db/db";
import couponModel from "@/lib/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDB();
    const { couponCode, email, subtotal } = await req.json();

    const coupon = await couponModel.findOne({
        code: couponCode,
        userEmail: email,
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });
    if (!coupon) {
        return NextResponse.json(
            { msg: "invalid" },
            { status: 400 }
        );
    }

    const discount = Math.floor((subtotal * coupon.discountValue) / 100);

    return NextResponse.json({
        msg: "success",
        discountValue: coupon.discountValue,
        discount,
    });
}
