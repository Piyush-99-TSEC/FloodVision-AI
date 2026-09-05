import mongoose from "mongoose";
import { seedDatabase } from "./seed";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined in .env file");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🟢 Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);

    // Seed database if initial records don't exist
    await seedDatabase();
  } catch (error) {
    console.error("🔴 Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
