import ProductCard from "@/components/custom/productCard/ProductCard";

export default async function SpecificBrand({ params }: { params: { brand: string } }) {
    const brand = params.brand;

    async function fetchProductsByBrand() {
        const res = await fetch(`${process.env.API}/api/product/getBrand/${brand}`, { cache: 'no-store' });
        const data: APIResponse<Product> = await res.json();
        return data;
    }
    const products = await fetchProductsByBrand()

    return (
        <div className="container my-4">
            <h3 className="text-3xl sm:text-4xl font-bold text-text mb-8 text-center mt-3">
                Products by {brand}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.msg == "success" && products?.products?.map((item) => (
                    <ProductCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
}
