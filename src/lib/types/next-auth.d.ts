/* eslint-disable unused-imports/no-unused-imports */
import NextAuth from "next-auth";
declare module "next-auth" {
    interface User {
        email: string;
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email: string;
    }
}
