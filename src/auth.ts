import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),


    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.email = user.email;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.email = token.email as string;
            }

            return session;
        },

    }
}


