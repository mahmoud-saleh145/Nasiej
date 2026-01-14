import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function PATCH(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();
        const { brand, raise, discount } = body;

        if (!brand) {
            return NextResponse.json({ msg: "Brand is required" }, { status: 400 });
        }

        const products = await productModel.find({ brand });

        if (!products.length) {
            return NextResponse.json(
                { msg: "No products found for this brand" },
                { status: 404 }
            );
        }

        for (const product of products) {
            product.raise = raise;
            product.discount = discount;
            await product.save();
        }

        return NextResponse.json({
            msg: "Products updated successfully",
            count: products.length,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
