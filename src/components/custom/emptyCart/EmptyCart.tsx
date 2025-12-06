import Link from "next/link";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-16">

            <h2 className="text-2xl font-semibold text-text mb-2">
                Your cart is empty 🛒
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
                Looks like you haven’t added anything to your cart yet.
                Browse our products and find something you’ll love!
            </p>
            <Link
                href="/"
                className="bg-buttons text-text link-underline link-underline-opacity-0 px-6 py-3 rounded-lg hover:bg-buttons-hover transition"
            >
                Continue Shopping
            </Link>
        </div>
    )
}