"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "../productCard/ProductCard";
export default function SearchCard() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length > 0) {
                fetchProducts(query);
            } else {
                setProducts([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    async function fetchProducts(searchTerm: string) {
        try {
            setLoading(true);
            const res = await fetch(`/api/product/getProducts?search=${encodeURIComponent(searchTerm)}`, { cache: "no-store", });
            const data: APIResponse<Product> = await res.json();

            if (data.msg === "success" && data.products.length > 0) {
                setEmpty(false)
                setProducts(data.products);
            } else if (data.msg === "success" && data.products.length === 0) {
                setEmpty(true)
                setProducts([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" ">
            {/* 🔹 Search Bar */}
            <div className="relative w-full max-w-md mb-10 mx-auto">
                <input
                    type="text"
                    placeholder="Search by name, category, or brand..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-5 py-3 pl-12 rounded-full border border-[#b48b65]/40 
                              focus:ring-2 focus:ring-[#b48b65] focus:border-transparent 
                             text-gray-700 placeholder:text-gray-400 shadow-sm outline-none transition"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b48b65] w-5 h-5" />
            </div>
            {/* 🔹 Loading State */}
            {loading ? (
                "loading..."
            ) : empty ? (
                <div className="text-center py-10">There is no products</div>
            ) : query !== "" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : ""}
        </div>
    );
}
