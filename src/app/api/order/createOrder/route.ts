import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import orderModel from "@/lib/models/order.model";
import { getUserFromToken } from "@/middleware/getUserFromToken";
import cartModel from "@/lib/models/cart.model";
import { calculateShipping } from "@/lib/utils/calculateShipping";
import getFinalPrice from "@/lib/utils/getFinalPrice";
import productModel from "@/lib/models/product.model";
import { generateRandomCode, orderCounter } from "@/lib/utils/orderCounter";
import userModel from "@/lib/models/user.model";
import { generateInvoice } from "@/lib/utils/generateInvoice";
import { sendEmail } from "@/lib/utils/sendEmail";
import { validateOrderData } from "@/lib/utils/validateOrderData";
import couponModel from "@/lib/models/coupon.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const sessionId = req.cookies.get("sessionId")?.value;
        const userId = await getUserFromToken(req);
        const body = (await req.json()) as Order;
        const { email, firstName, lastName, address, phone, city, governorate, paymentMethod = "cash", couponCode } = body
        validateOrderData(body);

        if (!sessionId && !userId) {
            return NextResponse.json({ msg: "Session or user not found" }, { status: 400 });

        }

        let cart
        if (userId) {
            cart = await cartModel
                .findOne({ userId })
                .populate("items.productId", "-createdAt -updatedAt -__v -hide");
        } else if (sessionId) {
            cart = await cartModel
                .findOne({ sessionId })
                .populate("items.productId", "-createdAt -updatedAt -__v -hide");
        }

        if (!cart || !cart.items.length)
            return NextResponse.json({ msg: "Cart does not exist or empty" }, { status: 400 });

        for (const item of cart.items) {
            const { productId, quantity, color } = item;

            const product = await productModel.findById(productId);
            if (!product)
                return NextResponse.json({ msg: "Product not found" }, { status: 404 });



            const variant = product.variants.find((v: Variant) => v.color === color);
            if (!variant)
                return NextResponse.json({ msg: `Color ${color} not found for product` }, { status: 404 });


            if (variant.stock < quantity)
                return NextResponse.json({ msg: `Not enough stock for color ${color} of ${product.name}` }, { status: 404 })


            variant.stock = Math.max(0, variant.stock - quantity);
            variant.reserved = Math.max(0, variant.reserved - quantity);


            await product.save();
        }

        const shippingCost = calculateShipping(governorate);
        const subtotal = cart.items.reduce(
            (acc: number, item: CartItem) => acc + getFinalPrice(item.productId) * item.quantity,
            0
        );

        let discount = 0;

        if (couponCode) {
            const coupon = await couponModel.findOne({
                code: couponCode,
                userEmail: email,
                isUsed: false,
                expiresAt: { $gt: new Date() }
            });

            if (!coupon) {
                return NextResponse.json(
                    { msg: "Invalid or expired coupon" },
                    { status: 400 }
                );
            }

            discount = (subtotal * coupon.discountValue) / 100;

            coupon.isUsed = true;
            await coupon.save();
        }
        const totalPrice = Math.floor(subtotal + shippingCost - discount);

        const orderNumber = await orderCounter("order");
        const randomId = generateRandomCode();

        const order = new orderModel({
            sessionId,
            userId,
            products: cart.items.map((item: OrderProduct) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.finalPrice ?? item.productId.price,
                color: item.color,
            })),
            orderNumber,
            randomId,
            subtotal,
            shippingCost,
            totalPrice,
            email,
            firstName,
            lastName,
            address,
            phone,
            city,
            governorate,
            paymentMethod
        });

        await order.save();
        await order.populate("products.productId", "-createdAt -updatedAt -__v -hide");

        cart.items = [];
        await cart.save();

        let user = await userModel.findOne({ email });
        if (user) {
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (address) user.address = address;
            if (phone) user.phone = phone;
            if (city) user.city = city;
            if (governorate) user.governorate = governorate;
            user.orders.push({ orderId: order._id });
            await user.save();
        } else {
            user = new userModel({
                email,
                firstName,
                lastName,
                address,
                phone,
                city,
                governorate,
                orders: [{ orderId: order._id }]
            });
            await user.save();
        }


        const html = generateInvoice(order);
        await sendEmail(order.email, `Order #${order.randomId} Confirmed`, html);
        await sendEmail("salehmahmoud327@gmail.com", `Order #${order.randomId} Confirmed`, html);
        await sendEmail("nasiej.eg@gmail.com", `Order #${order.randomId} Confirmed`, html);

        return NextResponse.json({
            msg: "success",
            order,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
