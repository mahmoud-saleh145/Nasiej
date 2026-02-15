// app/api/products/export/route.ts
import { NextResponse } from "next/server";
import productModel from "@/lib/models/product.model";
import { connectToDB } from "@/lib/db/db";
import { Parser } from "json2csv";

export async function GET() {
    await connectToDB();
    const products = await productModel.find().lean();

    const rows = [];
    for (const p of products) {
        for (const v of p.variants) {
            rows.push({
                _id: p._id,
                name: p.name,
                price: p.price,
                finalPrice: p.finalPrice,
                discount: p.discount,
                raise: p.raise,
                brand: p.brand,
                category: p.category,
                hide: p.hide,
                priceBeforeDiscount: p.priceBeforeDiscount,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                variantColor: v.color,
                variantStock: v.stock,
                variantReserved: v.reserved,
                variantImages: v.images.map((i: VariantImage) => i.url).join("|"),
            });
        }
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=products.csv",
        },
    });
}
