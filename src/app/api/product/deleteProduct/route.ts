import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function DELETE(req: Request) {
    try {
        await connectToDB();

        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({ msg: "Product id is required" }, { status: 400 });
        }

        const result = await productModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ msg: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ msg: "success" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "server error" }, { status: 500 });
    }
}
