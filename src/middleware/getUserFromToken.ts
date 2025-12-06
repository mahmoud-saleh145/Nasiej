import { connectToDB } from "@/lib/db/db";
import userModel from "@/lib/models/user.model";
import jwt from "jsonwebtoken";


export async function getUserFromToken(req: Request) {
    try {
        await connectToDB();
        const cookieHeader = req.headers.get("cookie");
        if (!cookieHeader) return null;
        const token = cookieHeader
            .split("; ")
            .find(c => c.startsWith("token="))
            ?.split("=")[1];


        if (!token) return null;

        const decoded: TokenPayload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;


        const user = await userModel.findById(decoded.id).lean();
        if (!user) return null;
        return user._id;

    } catch {
        return null;
    }
}
