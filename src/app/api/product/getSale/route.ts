import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();

        const products = await productModel.find({
            discount: { $gt: 0 }
        });

        return NextResponse.json({
            msg: "success",
            products
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
