"use client";

import { JSON_HEADER } from "@/lib/constants/api.constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";



async function fetchCart() {
    const res = await fetch(`/api/cart/getCart`, {
        credentials: "include",
        cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data: CartResponse = await res.json();
    return data;
}
export function useCart() {
    return useQuery({
        queryKey: ["cart"],
        queryFn: fetchCart,
    });
}


export async function fetchCartQuantity() {
    const res = await fetch(`/api/cart/getCartQuantity`, {
        credentials: "include",
        cache: "no-store"
    });
    const data: CartQuantityResponse = await res.json();
    if (!res.ok) {
        throw new Error("Failed to fetch quantity");
    }
    return {
        totalQuantity: data?.totalQuantity ?? 0,
    };
}

export function useCartQuantity() {
    return useQuery<CartQuantityResponse>({
        queryKey: ["cartQuantity"],
        queryFn: fetchCartQuantity,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: false,
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, color, quantity }: { productId: string; color?: string, quantity?: number }) => {
            const res = await fetch(`/api/cart/addToCart`, {
                method: "POST",
                headers: { ...JSON_HEADER },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify({ productId, color, quantity }),
            });
            const data: EditCartResponse = await res.json();

            if (!res.ok) throw new Error("Failed to update quantity");
            return data;
        },
        onSuccess: (data) => {

            if ("stockLimitReached" in data) {
                toast.error("Out of stock for this product");
            } else {
                toast.success("Added to cart!");
            }
            queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"], exact: true });

            if (typeof window !== "undefined" && window.fbq) {
                window.fbq?.("track", "AddToCart");
            }

        },
    });
}

export function useAddQuantity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, color }: { productId: string; color?: string }) => {
            const res = await fetch(`/api/cart/addQuantity`, {
                method: "PATCH",
                cache: "no-store",
                headers: { ...JSON_HEADER },
                credentials: "include",
                body: JSON.stringify({ productId, color }),
            })
            const data: EditCartResponse = await res.json();
            if (!res.ok) throw new Error("Failed to update quantity");
            return data;
        },
        onSuccess: (data) => {
            if ("stockLimitReached" in data) {
                toast.error("Out of stock for this product");
            } else {
                toast.success("Added to cart!");
            }
            queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"], exact: true });
        },
    });
}

export function useDecreaseQuantity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, color }: { productId: string; color?: string }) => {
            const res = await fetch(`/api/cart/reduceQuantity`, {
                method: "PATCH",
                cache: "no-store",
                headers: { ...JSON_HEADER },
                credentials: "include",
                body: JSON.stringify({ productId, color }),
            });
            const data: APIResponse<Cart> = await res.json()
            if (!res.ok) throw new Error("Failed to update quantity");
            return data;
        },
        onSuccess: () => {
            toast.success("Reduced item quantity");
            queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"], exact: true });
        },
    });
}

export function useRemoveProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, color }: { productId: string; color?: string }) => {
            const res = await fetch(`/api/cart/removeProduct`, {
                method: "PATCH",
                cache: "no-store",
                headers: { ...JSON_HEADER },
                credentials: "include",
                body: JSON.stringify({ productId, color }),
            });
            if (!res.ok) throw new Error("Failed to remove product");
            const data: EditCart = await res.json();
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"], exact: true });
        },
    });
}

export function useEmptyCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/cart/emptyCart`, {
                method: "PATCH",
                cache: "no-store",
                headers: { ...JSON_HEADER },
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to empty cart");
            const data: EditCart = await res.json()

            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"], exact: true });
        },
    });
}
