"use client";

import { useAddToCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";

interface AddToCartButtonProps {
    productId: string;
    selectedColor?: string;
    quantity?: number;
}

export default function AddToCartButton({
    productId,
    selectedColor,
    quantity

}: AddToCartButtonProps) {

    const { mutate: addToCart, isPending } = useAddToCart();
    const [showError, setShowError] = useState(false);

    const handleAddToCart = () => {
        if (!selectedColor) {
            setShowError(true);
            return;
        }

        addToCart(
            { productId, color: selectedColor, quantity }
        );
    };

    useEffect(() => {
        if (selectedColor) setShowError(false);
    }, [selectedColor]);

    return (
        <div className="col-10">
            <div className="relative flex flex-col items-start w-full">
                <button
                    onClick={handleAddToCart}
                    disabled={isPending}
                    className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300
            ${!selectedColor
                            ? "bg-buttons-disabled text-text cursor-not-allowed"
                            : "bg-buttons text-text hover:bg-buttons-hover hover:scale-[1.02]"
                        }
            ${isPending ? "opacity-70" : ""}
          `}
                >
                    {isPending ? "Adding..." : "Add to cart"}
                </button>

                {showError && !selectedColor && (
                    <p className="absolute -bottom-6 left-0 text-xs md:text-sm text-red-500 bg-background px-2 py-[2px] rounded-md shadow-sm">
                        Please select a color first
                    </p>
                )}
            </div>
        </div>
    );
}
