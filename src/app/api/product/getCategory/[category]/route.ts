
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function GET(req: Request, { params }: { params: { category: string } }) {
    try {
        await connectToDB();

        const { category } = params;

        const products = await productModel.find({
            category: { $regex: category, $options: "i" },
        });

        if (!products || products.length === 0) {
            return NextResponse.json(
                { msg: "No products found for this category" },
                { status: 404 }
            );
        }

        return NextResponse.json({ msg: "success", products });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}
