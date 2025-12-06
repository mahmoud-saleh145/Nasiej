import Link from "next/link";
export default async function BrandPage() {
    async function fetchBrands() {
        const res = await fetch(`${process.env.API}/api/product/getAllBrands`, { cache: "no-store" });
        const data: APIResponse<Brand> = await res.json();
        return data;
    }

    const brands = await fetchBrands();
    return (
        <div className="container my-4 px-6 sm:px-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-8 text-center">
                Browse by Brand
            </h1>

            {brands.msg === "success" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands?.brands?.map((brand, i) => (
                        <Link
                            key={i}
                            className="link-underline link-underline-opacity-0"
                            href={`/specificBrand/${brand.brand}`}
                        >
                            <div className="text-text-secondary hover:text-text bg-background hover:bg-buttons transition-colors rounded-2xl shadow-xl border hover:shadow-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer duration-300">
                                <h2 className="text-2xl  font-semibold mb-2 capitalize  ">
                                    {brand.brand}
                                </h2>
                                <p className="  text-sm">
                                    {brand.count} Product{brand.count > 1 ? "s" : ""}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center text-red-500 font-medium">
                    Failed to load brands.
                </div>
            )}
        </div>
    );
}
