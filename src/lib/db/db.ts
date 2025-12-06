import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("✅ MongoDB already connected");
            return;
        }

        await mongoose.connect(process.env.DB_URL_ONLINE as string);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error; // Optional: re-throw the error
    }
};
