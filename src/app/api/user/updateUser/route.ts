import { NextRequest, NextResponse } from "next/server";
import userModel from "@/lib/models/user.model";

export async function GET(req: NextRequest) {
    const { userId,
        email,
        firstName,
        lastName,
        address,
        phone,
        city,
        governorate } = await req.json()

    if (!userId) {
        return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
    }

    const user = await userModel.findById(userId)
    if (!user) {
        return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (governorate) user.governorate = governorate;

    await user.save();

    return NextResponse.json({
        msg: "success",
        user
    })
}