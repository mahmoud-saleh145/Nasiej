"use client";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishList";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";


export default function AddToWishListButton({ productId }: { productId: string }) {
    const { mutate: toggleWishlist, isPending } = useToggleWishlist();
    const { data: wishlist, isLoading, isError } = useWishlist();
    const [inWishlist, setInWishlist] = useState<boolean>();


    useEffect(() => {
        if (wishlist?.msg === "success") {

            const wishlistIds = wishlist?.wishList?.items?.map((item: WishList) => {
                if (typeof item?.productId === "string") return item?.productId;
                if (item.productId?._id) return item.productId._id.toString();
                return "";
            });

            setInWishlist(wishlistIds?.includes(productId))

        }
    }, [wishlist, inWishlist, productId]);

    const handleToggle = () => {
        setInWishlist((prev) => !prev);
        toggleWishlist({ productId });
    };


    return (
        <div
            onClick={handleToggle}
            className={`col-2 p-0 cursor-pointer pe-1 ${isPending || isLoading || isError ? "opacity-50" : ""
                }`}
        >
            {inWishlist ? (
                <FaHeart className="fs-3 mx-auto text-text" />
            ) : (
                <FaRegHeart className="fs-3 mx-auto text-text" />
            )}
        </div>
    );
}
