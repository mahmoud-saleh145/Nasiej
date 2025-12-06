"use client";

import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
    return (
        <Link href={"/cart"} className="cursor-pointer">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#2e261e",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#b48b65",
                            secondary: "#fff",
                        },
                    },
                }}
            />

        </Link>
    );
}
