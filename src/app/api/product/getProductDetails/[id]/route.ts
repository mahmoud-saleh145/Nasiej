// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();

        const { id } = params;

        const product = await productModel.findById(id);

        if (!product) {
            return NextResponse.json(
                { msg: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ msg: "success", product });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}
