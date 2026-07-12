import mongoose from "mongoose";
import { seedDefaultPermissions } from "../services/permission.service.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Seed default RBAC permissions on every startup (upsert — safe to repeat)
        await seedDefaultPermissions();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;