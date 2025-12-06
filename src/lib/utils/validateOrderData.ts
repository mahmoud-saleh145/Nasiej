import { NextResponse } from "next/server";

export function validateOrderData(data: Order) {
    const {
        email,
        firstName,
        lastName,
        address,
        phone,
        city,
        governorate
    } = data || {};

    // Email
    const emailRegex = /^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.(com)$/;
    if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ msg: "Invalid or missing email." }, { status: 400 });

    }

    // Names
    if (!firstName || firstName.length < 2) {
        return NextResponse.json({ msg: "First name is required and must be at least 2 characters" }, { status: 400 });

    }

    if (!lastName || lastName.length < 2) {

        return NextResponse.json({ msg: "Last name is required and must be at least 2 characters." }, { status: 400 });
    }

    // Address
    if (!address || address.length < 5) {
        return NextResponse.json({ msg: "Address is too short or missing." }, { status: 400 });

    }

    // Phone (Egypt format)
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return NextResponse.json({ msg: "Invalid Egyptian phone number." }, { status: 400 });

    }

    // City
    if (!city || city.length < 2) {
        return NextResponse.json({ msg: "City is required." }, { status: 400 });

    }

    // Governorate
    if (!governorate || governorate.length < 2) {
        return NextResponse.json({ msg: "Governorate is required." }, { status: 400 });
    }
    return true;
}