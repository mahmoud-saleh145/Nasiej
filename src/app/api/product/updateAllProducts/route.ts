import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function PATCH(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();
        const { priceChange, discountChange, raiseChange } = body;

        const products = await productModel.find({});

        if (!products.length) {
            return NextResponse.json(
                { msg: "No products found" },
                { status: 404 }
            );
        }

        for (const product of products) {

            if (typeof priceChange === "number") {
                product.price += priceChange;
                if (product.price < 0) product.price = 0;
            }

            if (typeof discountChange === "number") {
                product.discount = (product.discount || 0) + discountChange;
                if (product.discount < 0) product.discount = 0;
            }

            if (typeof raiseChange === "number") {
                product.raise = (product.raise || 0) + raiseChange;
                if (product.raise < 0) product.raise = 0;
            }

            await product.save();
        }

        return NextResponse.json({
            msg: "success",
            count: products.length,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { msg: "Server error" },
            { status: 500 }
        );
    }
}

