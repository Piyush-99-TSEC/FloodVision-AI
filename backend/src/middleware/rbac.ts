import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User";
import { AppError } from "./errorHandler";

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User is not authenticated", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role '${req.user.role}' is not authorized to perform this operation`,
          403
        )
      );
    }

    next();
  };
};
