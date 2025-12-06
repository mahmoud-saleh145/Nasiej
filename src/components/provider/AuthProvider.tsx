"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
export default function AuthProvider({ children }: { children: ReactNode }) {
    const { setLoggedIn, setRole } = useAuth();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/statusToken`, { cache: "no-store" });
                const data = await res.json();
                setLoggedIn(data.loggedIn);
                setRole(data.role);

            } catch {
                setLoggedIn(false);
                setRole(undefined);
            }
        };
        checkAuth();
    }, [setRole, setLoggedIn]);
    return <>{children}</>;
}