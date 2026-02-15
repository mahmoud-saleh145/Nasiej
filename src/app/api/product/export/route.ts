// app/api/products/export/route.ts
export const dynamic = "force-dynamic";

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
            const availableQty = Math.max(v.stock - v.reserved, 0);

            rows.push({
                id: `${p._id}-${v.color}`,
                title: `${p.name} - ${v.color}`,
                description: p.description?.replace(/\r?\n/g, " "),
                availability: availableQty > 0 ? "in stock" : "out of stock",
                condition: "new",
                price: `${p.finalPrice} EGP`,
                link: `https://www.nasiej.com/product/${p._id}`,
                image_link: v.images?.[0]?.url,
                brand: p.brand,
                item_group_id: p._id,
                status: p.hide ? "archived" : "active",
                color: v.color,
                quantity_to_sell_on_facebook: availableQty,
                google_product_category:
                    "Home & Garden > Linens & Bedding > Bedding > Comforters & Sets",
                fb_product_category:
                    "Home & Garden > Household Supplies > Bedding & Linens",
                additional_image_link: v.images
                    .slice(1)
                    .map((i: VariantImage) => i.url)
                    .join("|"),
            });
        }
    }

    const fields = [
        "id",
        "title",
        "description",
        "availability",
        "condition",
        "price",
        "link",
        "image_link",
        "brand",
        "item_group_id",
        "status",
        "color",
        "quantity_to_sell_on_facebook",
        "google_product_category",
        "fb_product_category",
        "additional_image_link"
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(rows);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=products.csv",
        },
    });
}
