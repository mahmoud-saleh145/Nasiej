import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function PATCH(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();
        const { category, raise, discount } = body;

        if (!category) {
            return NextResponse.json({ msg: "category is required" }, { status: 400 });
        }

        const result = await productModel.updateMany(
            { category },
            { raise, discount }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ msg: "No products found for this category" }, { status: 404 });
        }

        return NextResponse.json({ msg: "success", result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
