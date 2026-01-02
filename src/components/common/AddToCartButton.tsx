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

            setTimeout(() => {
                setShowError(false);
            }, 4000);
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
                    aria-label="Add to cart"
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


                <div
                    className={`absolute -bottom-5 left-0
                    transition-all duration-500 ease-out
                    ${showError
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3 pointer-events-none"
                        }`}
                >
                    <p className="text-xs md:text-sm text-red-500 bg-background px-2 py-[2px] rounded-md shadow-sm">
                        Please select a color first
                    </p>
                </div>
                {/* {showError && !selectedColor && (
                    <p className="absolute -bottom-6 left-0 text-xs md:text-sm text-red-500 bg-background px-2 py-[2px] rounded-md shadow-sm">
                        Please select a color first
                    </p>
                )} */}
            </div>
        </div>
    );
}
