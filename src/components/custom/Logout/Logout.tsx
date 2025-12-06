"use client";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
export default function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { setLoggedIn } = useAuth();
    const { setRole } = useAuth();

    const queryClient = useQueryClient();

    const handleLogout = async () => {
        setLoading(true)
        queryClient.clear();
        await fetch(`/api/auth/logout`, { method: "POST" });
        await signOut({ redirect: true });
        router.push('/', { scroll: false })
        setLoggedIn(false);
        setRole(undefined)
        setLoading(false)
    };

    return (
        <ConfirmDialog
            trigger={
                <button
                    className={` text-text  ${loading ? "opacity-70 " : ""}`}
                    disabled={loading}
                >
                    Logout
                </button>
            }
            title="Logout"
            description="Are you sure you want to logout"
            confirmText="Yes, Logout"
            cancelText="Cancel"
            onConfirm={() => handleLogout()}
        />
    );
}
