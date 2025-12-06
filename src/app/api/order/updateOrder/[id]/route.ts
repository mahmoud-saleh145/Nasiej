import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import orderModel from "@/lib/models/order.model";
import userModel from "@/lib/models/user.model";
import { validateOrderData } from "@/lib/utils/validateOrderData";





export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const { id } = params;
        const body = (await req.json()) as Order;
        const {
            email,
            firstName,
            lastName,
            address,
            phone,
            city,
            governorate,
            status,
            products } = body
        validateOrderData(body);


        const order = await orderModel.findById(id).populate("products.productId", "-createdAt -updatedAt -__v -hide")
        if (!order) {
            return NextResponse.json({ msg: "Order not found" }, { status: 404 });

        }
        if (email) order.email = email;
        if (firstName) order.firstName = firstName;
        if (lastName) order.lastName = lastName;
        if (address) order.address = address;
        if (phone) order.phone = phone;
        if (city) order.city = city;
        if (governorate) order.governorate = governorate;
        if (status) order.status = status;


        if (products && Array.isArray(products)) {
            order.products = products.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                price: p.price,
                color: p.color
            }));
        }

        await order.save();

        if (order.userId) {
            const user = await userModel.findById(order.userId);

            if (user) {
                if (email) user.email = email;
                if (firstName) user.firstName = firstName;
                if (lastName) user.lastName = lastName;
                if (address) user.address = address;
                if (phone) user.phone = phone;
                if (city) user.city = city;
                if (governorate) user.governorate = governorate;

                await user.save();
            }
        }

        return NextResponse.json({
            msg: "success",
            order,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
