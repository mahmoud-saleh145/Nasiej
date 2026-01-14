import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

export async function PATCH(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();
        const { raise, discount, increaseAmount } = body;

        const products = await productModel.find({});

        if (!products.length) {
            return NextResponse.json(
                { msg: "No products found" },
                { status: 404 }
            );
        }

        for (const product of products) {
            if (increaseAmount && increaseAmount > 0) {
                product.price += increaseAmount;
            }

            if (raise !== undefined && raise !== null) {
                product.raise = raise;
            }

            if (discount !== undefined && discount !== null) {
                product.discount = discount;
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
