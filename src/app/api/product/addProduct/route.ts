import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";
import { uploadToCloudinaryFile } from "@/lib/utils/cloudinary";

export async function POST(req: Request) {
    try {
        await connectToDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const brand = formData.get("brand") as string;
        const discount = parseFloat(formData.get("discount") as string || "0");
        const raise = parseFloat(formData.get("raise") as string || "20");
        const variantsMetaStr = formData.get("variantsMeta") as string;
        const variantsMeta = JSON.parse(variantsMetaStr);

        if (!name || !price || !description || !category || !variantsMeta || !brand) {
            return NextResponse.json({ msg: "Please provide all required fields" }, { status: 400 });
        }

        const files = formData.getAll("images") as File[];
        if (!files || files.length === 0) {
            return NextResponse.json({ msg: "Please upload at least one image" }, { status: 400 });
        }

        // Upload images to Cloudinary
        const uploadResults = await Promise.all(files.map(f => uploadToCloudinaryFile(f)));

        // Build variants
        const finalVariants = variantsMeta.map((v: VariantMeta) => {
            const images = (v.fileIndexes || []).map((idx: number) => ({
                url: uploadResults[idx]?.secure_url
            }));
            return {
                color: v.color,
                stock: v.stock || 0,
                reserved: 0,
                images
            };
        });

        const finalPrice = price + (price * (raise ?? 0) / 100) - (price * (discount ?? 0) / 100);

        // Save product
        const product = new productModel({
            name,
            price,
            description,
            category,
            brand,
            discount,
            raise: 20,
            variants: finalVariants,
            hide: false,
            finalPrice
        });
        await product.save();
        return NextResponse.json({ msg: "success", product }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Server error" }, { status: 500 });
    }
}
