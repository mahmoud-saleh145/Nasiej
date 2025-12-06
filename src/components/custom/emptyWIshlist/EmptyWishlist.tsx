import Link from "next/link";

export default function EmptyWishlist() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold text-text mb-2">
                💫 Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
                Add the items you love here to keep track of them easily —
                don’t let your favorites slip away! 💖
            </p>
            <Link
                href="/"
                className="bg-buttons text-text link-underline link-underline-opacity-0 px-6 py-3 rounded-lg hover:bg-buttons-hover transition font-medium"
            >
                Continue Shopping
            </Link>
        </div>
    );
}
