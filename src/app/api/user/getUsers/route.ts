import { connectToDB } from "@/lib/db/db";
import userModel from "@/lib/models/user.model";
import { Types } from "mongoose";

import { NextRequest, NextResponse } from "next/server";
interface GetOrdersBody {
    query?: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const body = (await req.json()) as GetOrdersBody;
        const { query } = body;
        const search = query?.trim() || "";

        const filter: {
            role: "user";
            $or?: Array<Record<string, unknown>>;
            _id?: string;
        } = {
            role: "user",
        };
        if (search) {
            if (Types.ObjectId.isValid(search)) {
                filter._id = search;
            } else {
                const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                filter.$or = [
                    { firstName: { $regex: escaped, $options: "i" } },
                    { lastName: { $regex: escaped, $options: "i" } },
                    { email: { $regex: escaped, $options: "i" } },
                    { phone: { $regex: escaped, $options: "i" } },
                ];
            }
        }

        const users = await userModel
            .find(filter)
            .populate("orders.orderId")
            .lean();


        return NextResponse.json({
            msg: "success",
            user: users,
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });

    }
}
