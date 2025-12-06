import ProductDetailsCard from "@/components/custom/productDetailsCard/ProductDetailsCard";

export default async function ProductDetails({ params }: { params: { id: string } }) {
    const id = params.id;

    async function fetchProductDetails() {
        const URL = process.env.API + `/api/product/getProductDetails/${id}`;
        const res = await fetch(URL, { cache: "no-store" });
        const data: APIResponse<{ product: ProductDetails }> = await res.json();
        return data;
    }

    const result = await fetchProductDetails()
    const details = result.msg === "success" ? result.product : null;
    const variants = details?.variants || [];

    return (
        <div className="container my-4">
            <ProductDetailsCard details={details!} variants={variants} />
        </div>
    );
}
