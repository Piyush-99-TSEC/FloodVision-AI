import { AuditLog } from "../models/AuditLog";
import { AuthUserPayload } from "../types";

export const logAudit = async (params: {
  user?: AuthUserPayload;
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
}): Promise<void> => {
  try {
    await AuditLog.create({
      userId: params.user?.id || null,
      userName: params.user?.name || "Guest/Public",
      userRole: params.user?.role || "guest",
      action: params.action,
      resource: params.resource,
      details: params.details || null,
      ipAddress: params.ipAddress || null,
    });
  } catch (error) {
    console.error("⚠️ AuditLog writing failed:", error);
  }
};
