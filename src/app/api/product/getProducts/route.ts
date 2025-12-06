import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";

type ProductQuery = {
    $or?: Array<Record<string, { $regex: string; $options: string }>>;
    name?: { $regex: string; $options: string };
    category?: { $regex: string; $options: string };
    brand?: { $regex: string; $options: string };
    price?: {
        $gte?: number;
        $lte?: number;
    };
    finalPrice?: {
        $gte?: number;
        $lte?: number;
    };
    priceField?: {
        $gte?: number;
        $lte?: number;
    };
};

type SortQuery = {
    [key: string]: 1 | -1;
};

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const searchParams = req.nextUrl.searchParams;

        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.max(parseInt(searchParams.get("limit") || "10"), 1);
        const skip = (page - 1) * limit;

        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const search = searchParams.get("search");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortParam = searchParams.get("sort");

        const query: ProductQuery = {};

        if (category) query.category = { $regex: category, $options: "i" };
        if (brand) query.brand = { $regex: brand, $options: "i" };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        const priceField = 'finalPrice' in productModel.schema.obj ? 'finalPrice' : 'price';


        if (minPrice || maxPrice) {
            query[priceField] = {};
            if (minPrice) query[priceField].$gte = Number(minPrice);
            if (maxPrice) query[priceField].$lte = Number(maxPrice);
        }

        const sort: SortQuery = {};
        switch (sortParam) {
            case "price_asc":
                sort[priceField] = 1;
                break;
            case "price_desc":
                sort[priceField] = -1;
                break;
            case "newest":
                sort.createdAt = -1;
                break;
            default:
                break;
        }

        const total = await productModel.countDocuments(query);
        const products = await productModel.find(query).sort(sort).skip(skip).limit(limit);

        return NextResponse.json(
            {
                msg: "success",
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                products,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "server error" }, { status: 500 });
    }
}
