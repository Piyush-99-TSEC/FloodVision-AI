import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | string;
  userName?: string;
  userRole?: string;
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.Mixed,
      default: null,
      index: true,
    },
    userName: {
      type: String,
      default: "Anonymous",
    },
    userRole: {
      type: String,
      default: "guest",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
