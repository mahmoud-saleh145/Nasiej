import HomePoster from "@/components/custom/homePoster/HomePoster";
import ProductFilters from "@/components/custom/productFilters/ProductFilters";
import ProductList from "@/components/custom/productLists/ProductList";
export default async function ProductsPage() {

  return (
    <div className="">
      <div className="flex items-start justify-center min-h-[200px] md:min-h-[400px] lg:min-h-[600px] ">
        <HomePoster />
      </div>

      <div className="container-fluid mx-auto  py-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:px-6 px-2 ">
          <div className="lg:w-64">
            <ProductFilters />
          </div>
          <div className="flex-1 overflow-hidden min-h-screen pb-5">
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}
