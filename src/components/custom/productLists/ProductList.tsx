"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../productCard/ProductCard";
// import Loading from "@/app/loading";
import ProductCardAdmin from "@/components/adminComponents/productCardAdmin/ProductCardAdmin";
import AddProductModal from "@/components/adminComponents/addProductModel/AddProductModal";
import { useAuth } from "@/hooks/useAuth";
import { TailSpin } from "react-loader-spinner";


export default function ProductList() {
    const role = useAuth((state) => state.role);
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [pageInfo, setPageInfo] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [openAdd, setOpenAdd] = useState(false);
    const [empty, setEmpty] = useState(false);

    const buildUrl = useCallback(() => {
        const base = `/api/product/getProducts`;
        const sp = new URLSearchParams(searchParams?.toString() || "");
        if (!sp.get("page")) sp.set("page", String(pageInfo.page));
        if (!sp.get("limit")) sp.set("limit", String(pageInfo.limit));
        return `${base}?${sp.toString()}`;
    }, [searchParams, pageInfo.page, pageInfo.limit]);


    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const url = buildUrl();
            const res = await fetch(url, { cache: "no-store" });
            const data: APIResponse<Product> = await res.json();
            console.log("dataaaaa", data)
            if (data.msg === "success" && data.products.length > 0) {
                setEmpty(false)
                setProducts(data.products);
                setPageInfo({
                    page: data.page || 1,
                    limit: data.limit || pageInfo.limit,
                    total: data.total || 0,
                    totalPages: data.totalPages || 0,
                });
            } else if (data.msg === "success" && data.products.length === 0) {
                setEmpty(true)
                setProducts([]);
            }
        } catch (err) {
            console.error("fetch products error:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [buildUrl, pageInfo.limit]);


    const searchParamsString = searchParams?.toString();

    useEffect(() => {
        fetchProducts();
    }, [searchParamsString, fetchProducts]);

    const handleReset = () => {
        const sp = new URLSearchParams();
        const url = `?${sp.toString()}`;
        window.history.pushState({}, "", url);
        fetchProducts();
    };


    return (
        <div>
            {role === "admin" ?
                <div className="">
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="bg-buttons text-white px-4 py-2 rounded mb-4 hover:bg-buttons-hover"
                    >
                        + Add Product
                    </button>

                    {openAdd && (
                        <AddProductModal
                            onClose={() => setOpenAdd(false)}
                        />
                    )}
                </div>
                :
                ""
            }
            <div className="">

                {empty ? (
                    <div className="text-center text-text py-10">
                        <div className="text-text ">There is no products</div>
                        <p className="text-lg fw-semibold hover:text-text-secondary hover:underline cursor-pointer"
                            onClick={handleReset}

                        >reset</p>
                    </div>

                ) : (
                    <div className="relative ">
                        {loading ?
                            <div className="absolute top-0 bottom-0 end-0 start-0 flex items-start mt-8 justify-center min-h-screen  opacity-50">
                                <TailSpin
                                    visible={true}
                                    height="80"
                                    width="80"
                                    color="#3a2f25"
                                    ariaLabel="tail-spin-loading"
                                    radius="1"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                            :
                            role !== "admin" ?
                                <div className=" grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">

                                    {products.map((p) => (
                                        <ProductCard key={p._id} product={p} />
                                    ))}
                                </div>
                                :
                                <div className=" grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">

                                    {products.map((p) => (
                                        <ProductCardAdmin key={p._id} product={p} />
                                    ))}
                                </div>
                        }

                        {pageInfo.totalPages >= 2 ?
                            <div className="flex justify-center items-center gap-2 mt-5">
                                <button
                                    onClick={() => {
                                        const sp = new URLSearchParams(searchParams.toString());
                                        const newPage = Math.max(1, (Number(sp.get("page")) || 1) - 1);
                                        sp.set("page", String(newPage));
                                        const url = `?${sp.toString()}`;
                                        window.history.pushState({}, "", url);
                                        window.dispatchEvent(new PopStateEvent("popstate"));
                                    }}
                                    disabled={pageInfo.page <= 1}
                                    className="px-3 py-2 rounded-lg border disabled:opacity-50 hover:bg-buttons-hover"
                                >
                                    Back
                                </button>
                                {(() => {
                                    const pages: (number | string)[] = [];
                                    const total = pageInfo.totalPages;
                                    const current = pageInfo.page;

                                    if (total <= 7) {

                                        for (let i = 1; i <= total; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        if (current > 4) pages.push("...");

                                        const start = Math.max(2, current - 2);
                                        const end = Math.min(total - 1, current + 2);

                                        for (let i = start; i <= end; i++) pages.push(i);

                                        if (current < total - 3) pages.push("...");
                                        pages.push(total);
                                    }

                                    return pages.map((p, idx) =>
                                        typeof p === "number" ? (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    const sp = new URLSearchParams(searchParams.toString());
                                                    sp.set("page", String(p));
                                                    const url = `?${sp.toString()}`;
                                                    window.history.pushState({}, "", url);
                                                    window.dispatchEvent(new PopStateEvent("popstate"));
                                                }}
                                                className={`px-3 py-2 rounded-lg border transition 
                                      ${p === current
                                                        ? "bg-buttons text-white border-buttons"
                                                        : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ) : (
                                            <span key={idx} className="px-2 text-gray-500 select-none">
                                                {p}
                                            </span>
                                        )
                                    );
                                })()}
                                <button
                                    onClick={() => {
                                        const sp = new URLSearchParams(searchParams.toString());
                                        const newPage = Math.min(pageInfo.totalPages, (Number(sp.get("page")) || 1) + 1);
                                        sp.set("page", String(newPage));
                                        const url = `?${sp.toString()}`;
                                        window.history.pushState({}, "", url);
                                        window.dispatchEvent(new PopStateEvent("popstate"));
                                    }}
                                    disabled={pageInfo.page >= pageInfo.totalPages}
                                    className="px-3 py-2 rounded-lg border disabled:opacity-50 hover:bg-buttons-hover"
                                >
                                    Next
                                </button>
                            </div>
                            :
                            ''
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
