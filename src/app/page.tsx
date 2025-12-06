import ProductFilters from "@/components/custom/productFilters/ProductFilters";
import ProductList from "@/components/custom/productLists/ProductList";
import img from "../../public/main-name.png"
import Image from "next/image"
export default async function ProductsPage() {

  return (
    <div className="">
      <div className=" mb-3 md:mb-6 flex items-start justify-center min-h-[200px]">
        <div className="flex align-items-center justify-center">

          <video
            className="w-full "
            autoPlay
            muted
            preload="auto"
            playsInline
            poster="/poster.png"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>

          <div className=" absolute w-1/2 h-1/4 logo-text ">
            <Image
              src={img}
              alt="Nasieچ Logo"
              fill
              style={{ objectFit: "contain" }}
              priority

            />
          </div>
        </div>

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
