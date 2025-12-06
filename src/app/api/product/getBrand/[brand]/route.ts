
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function GET(req: Request, { params }: { params: { brand: string } }) {
    try {
        await connectToDB();

        const { brand } = params;

        const products = await productModel.find({
            brand: { $regex: brand, $options: "i" },
        });

        if (!products || products.length === 0) {
            return NextResponse.json(
                { msg: "No products found for this brand" },
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
