import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import caseRoutes from "./routes/caseRoutes";
import imageRoutes from "./routes/imageRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";
import resultRoutes from "./routes/resultRoutes";
import reportRoutes from "./routes/reportRoutes";
import { errorHandler, AppError } from "./middleware/errorHandler";
import { sendSuccess } from "./utils/responseHandler";

const app: Application = express();

// Middlewares — allow all local origins (localhost and 127.0.0.1) dynamically
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/v1/health", (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  return sendSuccess(
    res,
    "FloodVisionAI backend is healthy",
    {
      status: "OK",
      database: isDbConnected ? "connected" : "disconnected",
    },
    200
  );
});

// API Routes Mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cases", caseRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/assessments", assessmentRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/reports", reportRoutes);

// Catch-all 404 Handler (compatible with Express v5)
app.use((req: Request, _res: Response, next) => {
  next(new AppError(`Cannot find path ${req.originalUrl} on this server`, 404));
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
