import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the project root .env explicitly so running from different CWDs doesn't break
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri || typeof uri !== "string" || uri.trim() === "") {
            throw new Error("MONGO_URI is not set. Create a .env with MONGO_URI or export it in the environment.");
        }
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error", error);
        throw error;
    }
};

export default connectDB;
