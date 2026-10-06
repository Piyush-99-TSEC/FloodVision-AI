import mongoose, { Schema, Document } from "mongoose";

export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ITeamAssignment extends Document {
  assignmentId: string;
  taskId: string;
  teamId: string;
  sceneId: string;
  buildingId: number;
  taskType: string;
  riskScore: number;
  urgency: string;
  compatibilityReason: string;
  distanceKm: number;
  allocationScore: number;
  assignmentStatus: AssignmentStatus;
  assignedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamAssignmentSchema = new Schema<ITeamAssignment>(
  {
    assignmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taskId: {
      type: String,
      required: true,
      index: true,
    },
    teamId: {
      type: String,
      required: true,
      index: true,
    },
    sceneId: {
      type: String,
      required: true,
      index: true,
    },
    buildingId: {
      type: Number,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    urgency: {
      type: String,
      required: true,
    },
    compatibilityReason: {
      type: String,
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },
    allocationScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    assignmentStatus: {
      type: String,
      enum: ["ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "ASSIGNED",
      required: true,
      index: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TeamAssignment = mongoose.model<ITeamAssignment>(
  "TeamAssignment",
  TeamAssignmentSchema
);
