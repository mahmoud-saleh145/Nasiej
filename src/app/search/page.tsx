import SearchCard from "@/components/custom/searchCard/SearchCard";
import Link from "next/link";

export default async function SearchPage() {

    async function fetchCategory() {
        const res = await fetch(`/api/product/getAllCategories`, { cache: "no-store" });
        const data: APIResponse<Category> = await res.json();
        return data;
    }

    const category = await fetchCategory()

    return (
        <section className="container w-full my-16 px-6 flex flex-col items-center  ">
            <h1 className="text-4xl font-bold text-text mb-3 text-center">
                Discover Comfort & Elegance with <span className="text-[#b48b65]">Nasieچ</span>
            </h1>
            <p className="text-text-secondary mb-8 max-w-md text-center">
                Shop premium bedding and fabrics that bring style and warmth to every corner of your home.
            </p>


            <div className="flex flex-wrap justify-center gap-3">
                {category.msg === "success" && category.categories.map((item, index) => (

                    <Link key={index}
                        className="link-underline link-underline-opacity-0 px-4 py-2 rounded-full border border-[#b48b65] text-[#b48b65] hover:bg-[#b48b65] hover:text-white transition"
                        href={`/specificCategory/${item.category}`}>

                        {item.category}

                    </Link>
                ))}
            </div>

            <div className="w-100 my-4">

                <SearchCard />
            </div>


        </section>
    );
}
