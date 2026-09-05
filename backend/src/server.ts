import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  // Ensure database connection succeeds before starting server
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FloodVisionAI backend server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  });
};

startServer();