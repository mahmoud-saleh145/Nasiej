import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db/db";
import "@/lib/models/order.model";
import "@/lib/models/user.model";
import cartModel from "@/lib/models/cart.model";
import wishListModel from "@/lib/models/wishlist.model";
import { sendEmail } from "@/lib/utils/sendEmail";
import userModel from "@/lib/models/user.model";
import { generateWelcomeCoupon, generateWelcomeCouponEmail } from "@/lib/utils/generateWelcomeCoupon";
import couponModel from "@/lib/models/coupon.model";


export async function POST(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();
        const { email } = body;

        const emailRegex = /^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.(com)$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json({ msg: "Invalid email format" }, { status: 400 });
        }

        let user = await userModel.findOne({ email }).populate("orders.orderId");

        // Create new user
        if (!user) {
            user = new userModel({ email });
            await user.save();

            const couponCode = generateWelcomeCoupon();

            await couponModel.create({
                code: couponCode,
                discountValue: 10,
                userEmail: email,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            const couponHtml = generateWelcomeCouponEmail({
                couponCode,
                discountValue: 10,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            const emailResult = await sendEmail(
                email,
                "🎁 Your 10% Welcome Discount is Here!",
                couponHtml
            );

            if (emailResult.success) {
                user.hasReceivedWelcomeCoupon = true;
                console.log("success");

                await user.save();
            } else {
                console.log("fail");

                await couponModel.deleteOne({ code: couponCode });
            }
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );


        const finalUserData = await userModel
            .findById(user._id)
            .populate("orders.orderId");

        // Prepare response with cookies
        const response = NextResponse.json(
            { msg: "success", token, user: finalUserData },
            { status: 200 }
        );

        // Save token cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        // Read sessionId
        const cookieHeader = req.headers.get("cookie") || "";
        const sessionId = cookieHeader
            .split("; ")
            .find((c) => c.startsWith("sessionId="))
            ?.split("=")[1];

        if (sessionId) {
            await mergeCartAuto(sessionId, user._id);
            await mergeWishlistAuto(sessionId, user._id);
        }

        // Clear sessionId
        response.cookies.set("sessionId", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });

        return response

    } catch (error) {
        console.log(error);
        return NextResponse.json({ msg: "server error" }, { status: 500 });
    }
}


// ---------------------------
// Merge Cart
// ---------------------------

async function mergeCartAuto(sessionId: string, userId: string) {
    const sessionCart = await cartModel.findOne({ sessionId });
    const userCart = await cartModel.findOne({ userId });

    if (!sessionCart && !userCart) return;

    // No user cart → replace
    if (sessionCart && !userCart) {
        sessionCart.userId = userId;
        sessionCart.sessionId = undefined;
        await sessionCart.save();
        return;
    }

    if (!sessionCart) return;

    if (sessionCart.items.length === 0) {
        await sessionCart.deleteOne();
        return;
    }

    // Merge
    for (const item of sessionCart.items) {
        const existing = userCart.items.find(
            (i: CartItem) =>
                i.productId.toString() === item.productId.toString() &&
                i.color === item.color
        );

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            userCart.items.push({
                productId: item.productId,
                quantity: item.quantity,
                color: item.color,
            });
        }
    }

    await userCart.save();
    await sessionCart.deleteOne();
}


// ---------------------------
// Merge Wishlist
// ---------------------------

async function mergeWishlistAuto(sessionId: string, userId: string) {
    const sessionWish = await wishListModel.findOne({ sessionId });
    const userWish = await wishListModel.findOne({ userId });

    if (!sessionWish && !userWish) return;

    if (sessionWish && !userWish) {
        sessionWish.userId = userId;
        sessionWish.sessionId = undefined;
        await sessionWish.save();
        return;
    }

    if (!sessionWish) return;

    sessionWish.items.forEach((item: WishList) => {
        const exists = userWish.items.find(
            (i: WishList) => i.productId.toString() === item.productId.toString()
        );
        if (!exists) userWish.items.push({ productId: item.productId });
    });

    await userWish.save();
    await sessionWish.deleteOne();
}
