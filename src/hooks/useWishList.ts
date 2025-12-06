"use client";

import { JSON_HEADER } from "@/lib/constants/api.constants";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export async function fetchWishlist() {
    const res = await fetch(`/api/wishlist/getWishlist`, {
        credentials: "include",
        cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    const data: APIResponse<wishListFetch> = await res.json();
    return data;
}

export function useWishlist() {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: fetchWishlist,
    });
}

export function useToggleWishlist() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId }: { productId: string }) => {
            const res = await fetch(`/api/wishlist/toggleWishList`, {
                method: "POST",
                headers: { ...JSON_HEADER },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) throw new Error("Failed to toggle wishlist");
            const data: ToggleWishlist<wishListFetch> = await res.json()
            console.log(data)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });
}


export function useEmptyWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/wishlist/emptyWishList`, {
                method: "PATCH",
                headers: { ...JSON_HEADER },
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to empty wishlist");
            const data: EmptyWishlist = await res.json();
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });
}
