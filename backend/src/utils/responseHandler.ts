import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  error?: any,
  statusCode: number = 500
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(error !== undefined && { error: typeof error === "string" ? error : error?.message || error }),
  };
  return res.status(statusCode).json(payload);
};
