
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET() {
    const token = cookies().get("token")?.value;

    if (!token) {
        const res: StatusTokenResponse = { loggedIn: false };
        return NextResponse.json(res);
    }

    try {
        const decoded = jwt.verify(token, SECRET) as TokenPayload;

        const res: StatusTokenResponse = {
            loggedIn: true,
            user: decoded,
            role: decoded.role,
        };

        return NextResponse.json(res);

    } catch (err) {
        console.log(err);

        const res: StatusTokenResponse = { loggedIn: false };
        return NextResponse.json(res);
    }
}
