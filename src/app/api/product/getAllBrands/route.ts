// app/api/products/brands/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function GET() {
    try {
        await connectToDB();

        const brands = await productModel.aggregate([
            {
                $group: {
                    _id: "$brand",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    brand: "$_id",
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);

        if (!brands || brands.length === 0) {
            return NextResponse.json(
                { msg: "No brands found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ msg: "success", brands });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}
