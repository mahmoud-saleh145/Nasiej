import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import orderModel from "@/lib/models/order.model";
import { SortOrder } from "mongoose";

interface GetOrdersBody {
    query?: string;
    status?: "placed" | "shipped" | "delivered";
    sort?: "newest" | "oldest";
    page?: number;
    limit?: number;
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = (await req.json()) as GetOrdersBody;
        const { query, status, sort, page = 1, limit = 10 } = body;

        const search = query?.trim() || "";

        const filter: {
            $or?: Array<Record<string, unknown>>;
            status?: "placed" | "shipped" | "delivered";
        } = {};

        // escape regex chars
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { randomId: { $regex: escaped, $options: "i" } },
                { firstName: { $regex: escaped, $options: "i" } },
                { lastName: { $regex: escaped, $options: "i" } },
                { phone: { $regex: escaped, $options: "i" } },
            ];

            if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
                filter.$or.push({
                    createdAt: {
                        $gte: new Date(`${search}T00:00:00`),
                        $lte: new Date(`${search}T23:59:59`),
                    },
                });
            }
        }

        if (status) {
            filter.status = status;
        }

        let sortOption: Record<string, SortOrder> = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const total = await orderModel.countDocuments(filter);

        const orders = await orderModel
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .populate({
                path: "products.productId",
                select: "-createdAt -hide -raise -discount -reserved -stock",
            })
            .lean();

        return NextResponse.json({
            msg: "success",
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            orders,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
