import { connectToDB } from "@/lib/db/db";
import couponModel from "@/lib/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDB();
    const { couponCode, email, subtotal } = await req.json();

    const coupon = await couponModel.findOne({
        code: couponCode.toUpperCase(),
        expiresAt: { $gt: new Date() },
        $or: [
            { isGlobal: true },
            { userEmail: email }
        ],
        $expr: {
            $lt: ["$usedCount", "$usageLimit"]
        }
    });

    console.log({
        couponCode,
        email,
        subtotal,
        coupon
    });
    if (!coupon) {
        return NextResponse.json(
            { msg: "invalid" },
            { status: 400 }
        );
    }

    const rawDiscount = (subtotal * coupon.discountValue) / 100;
    const discount = Math.ceil(rawDiscount / 5) * 5;

    return NextResponse.json({
        msg: "success",
        discountValue: coupon.discountValue,
        discount,
    });
}
