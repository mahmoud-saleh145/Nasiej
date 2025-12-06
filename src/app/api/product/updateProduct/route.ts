import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import productModel from "@/lib/models/product.model";
import { uploadToCloudinaryFile } from "@/lib/utils/cloudinary";

interface VariantImage {
    url: string;
}

interface Variant {
    color: string;
    stock: number;
    reserved: number;
    images: VariantImage[];
}

interface UploadVariant {
    color: string;
    stock?: number;
    fileIndexes?: number[];
    keepOldImages?: string[];
}

export async function PATCH(req: Request) {
    try {
        await connectToDB();

        // Get FormData
        const formData = await req.formData();

        const id = formData.get("id")?.toString() || "";
        const name = formData.get("name")?.toString() || "";
        const price = Number(formData.get("price") || 0);
        const discount = Number(formData.get("discount") || 0);
        const raise = Number(formData.get("raise") || 0);
        const hide = formData.get("hide") === "true";
        const brand = formData.get("brand")?.toString() || "";
        const category = formData.get("category")?.toString() || "";
        const description = formData.get("description")?.toString() || "";

        // Parse variantsMeta
        let parsedVariants: UploadVariant[] = [];
        try {
            const variantsMeta = formData.get("variantsMeta")?.toString() || "[]";
            parsedVariants = JSON.parse(variantsMeta);
        } catch {
            return NextResponse.json({ msg: "Invalid variantsMeta JSON" }, { status: 400 });
        }

        // Fetch old product
        const product = await productModel.findById(id);
        if (!product) {
            return NextResponse.json({ msg: "Product not found" }, { status: 404 });
        }

        // Upload new files
        const files = formData.getAll("files") as File[];
        let uploadResults: { secure_url: string }[] = [];
        if (files.length > 0) {
            uploadResults = await Promise.all(files.map(f => uploadToCloudinaryFile(f)));
        }

        // Build new variants
        const updatedVariants: Variant[] = parsedVariants.map((v: UploadVariant) => {
            const oldVariant = product.variants.find((x: Variant) => x.color === v.color);

            const oldImages: VariantImage[] = (v.keepOldImages || []).map(url => ({ url }));
            const newImages: VariantImage[] = (v.fileIndexes || []).map(idx => ({
                url: uploadResults[idx]?.secure_url
            }));

            return {
                color: v.color,
                stock: v.stock ?? oldVariant?.stock ?? 0,
                reserved: oldVariant?.reserved ?? 0,
                images: [...oldImages, ...newImages]
            };
        });

        // Update product fields
        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        product.brand = brand;
        product.discount = discount;
        product.raise = raise;
        product.hide = hide;
        product.variants = updatedVariants;

        await product.save();

        return NextResponse.json({ msg: "success", product });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "server error" }, { status: 500 });
    }
}
