import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User";
import { AppError } from "./errorHandler";
import { AuthUserPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_local_secret_change_me_before_deploying";

export const generateToken = (user: IUser): string => {
  const payload: AuthUserPayload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication token is missing or invalid", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Authentication token is missing", 401));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;

    const user = await User.findById(decoded.id);
    if (!user || user.status !== "active") {
      return next(new AppError("User account no longer exists or is inactive", 401));
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired authentication token", 401));
  }
};
