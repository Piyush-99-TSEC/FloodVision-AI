import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { seedDatabase } from "./seed";

async function runStandaloneSeed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    console.log("Connecting to MongoDB Atlas for manual database seed...");
    await mongoose.connect(mongoUri);
    console.log("🟢 Connected to MongoDB.");

    await seedDatabase(true);

    console.log("Seeding complete. Disconnecting from database.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Manual seeding failed:", err);
    process.exit(1);
  }
}

runStandaloneSeed();
