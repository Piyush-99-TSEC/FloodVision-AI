import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/responseHandler";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("❌ Error caught by global handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorDetails = process.env.NODE_ENV === "development" ? err.stack || err : undefined;

  return sendError(res, message, errorDetails, statusCode);
};
