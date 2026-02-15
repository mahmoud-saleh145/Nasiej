import { connectToDB } from "@/lib/db/db";
import couponModel from "@/lib/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const {
            code,
            discountValue,
            expiresAt,
            usageLimit = 1,
            isGlobal = false,
            userEmail
        } = await req.json();

        // ---------- Validation ----------
        if (!code || !discountValue || !expiresAt) {
            return NextResponse.json(
                { msg: "Missing required fields" },
                { status: 400 }
            );
        }

        if (discountValue <= 0 || discountValue > 100) {
            return NextResponse.json(
                { msg: "Invalid discount value" },
                { status: 400 }
            );
        }

        if (!isGlobal && !userEmail) {
            return NextResponse.json(
                { msg: "userEmail is required for private coupons" },
                { status: 400 }
            );
        }

        // ---------- Check Duplicate ----------
        const exists = await couponModel.findOne({
            code: code.toUpperCase()
        });

        if (exists) {
            return NextResponse.json(
                { msg: "Coupon already exists" },
                { status: 400 }
            );
        }

        // ---------- Create ----------
        const coupon = await couponModel.create({
            code: code.toUpperCase(),
            discountValue,
            expiresAt: new Date(expiresAt),
            usageLimit,
            isGlobal,
            userEmail: isGlobal ? undefined : userEmail
        });

        return NextResponse.json({
            msg: "success",
            coupon
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}


// {
//   "code": "SG5",
//   "discountValue": 5,
//   "expiresAt": "2027-03-31T23:59:59.000Z",
//   "usageLimit": 1000,
//   "isGlobal": true
// }



// {
//   "code": "MAH10",
//   "discountValue": 10,
//   "expiresAt": "2026-06-01T23:59:59.000Z",
//   "usageLimit": 1,
//   "isGlobal": false,
//   "userEmail": "test@gmail.com"
// }