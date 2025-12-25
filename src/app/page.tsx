import ProductFilters from "@/components/custom/productFilters/ProductFilters";
import ProductList from "@/components/custom/productLists/ProductList";
import img from "../../public/main-name.png"
import Image from "next/image"
import VideoHero from "@/components/custom/videoHero/VideoHero";
export default async function ProductsPage() {

  return (
    <div className="">
      <div className="relative flex items-start justify-center min-h-[200px] md:min-h-[400px] lg:min-h-[600px]  ">
        <div className="flex items-center justify-center ">

          {/* <video
            className="w-full"
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            poster="/poster.png"
            ref={(el) => {
              if (el) {
                el.muted = true;
                el.play().catch(() => { });
              }
            }}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video> */}

          <VideoHero poster="/poster.png" />


          <div className="flex items-center justify-center absolute top-0 bottom-0 w-full logo-text  ">
            <Image
              src={img}
              alt="Nasieچ Logo"
              width={1200}
              height={600}
              className="w-1/2 h-ato select-none  object-contain"
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

