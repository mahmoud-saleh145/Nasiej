export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function GET() {
    try {
        await connectToDB();
        const categories = await productModel.aggregate([
            {
                $match: {
                    category: { $exists: true, $ne: null },
                    hide: false
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1,
                },
            },
            { $sort: { count: -1 } },
        ]);

        if (!categories || categories.length === 0) {
            return NextResponse.json(
                { msg: "No categories found" },
                { status: 202 }
            );
        }

        return NextResponse.json(
            { msg: "success", categories },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { msg: "No categories found", categories: [] },
            { status: 200 }
        );
    }
}
