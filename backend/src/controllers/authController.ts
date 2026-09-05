import { Request, Response } from "express";
import { User, UserRole } from "../models/User";
import { generateToken } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { sendSuccess } from "../utils/responseHandler";
import { logAudit } from "../services/auditService";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("A user with this email address already exists", 400);
  }

  // Assign requested role if valid, defaulting to 'viewer'
  const validRoles: UserRole[] = ["admin", "officer", "analyst", "viewer"];
  const assignedRole: UserRole = role && validRoles.includes(role as UserRole)
    ? (role as UserRole)
    : "viewer";

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: assignedRole,
  });

  const token = generateToken(user);

  await logAudit({
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    action: "USER_REGISTER",
    resource: "/api/v1/auth/register",
    details: { assignedRole: user.role },
    ipAddress: req.ip,
  });

  const userResponse = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };

  return sendSuccess(
    res,
    "User registered successfully",
    { user: userResponse, token },
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "active") {
    throw new AppError("Account is inactive. Please contact system administrator.", 403);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  await logAudit({
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    action: "USER_LOGIN",
    resource: "/api/v1/auth/login",
    ipAddress: req.ip,
  });

  const userResponse = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  return sendSuccess(res, "Login successful", { user: userResponse, token }, 200);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("User not authenticated", 401);
  }

  return sendSuccess(res, "User profile retrieved successfully", { user: req.user }, 200);
});
