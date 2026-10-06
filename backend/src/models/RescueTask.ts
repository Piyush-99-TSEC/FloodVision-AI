import mongoose, { Schema, Document } from "mongoose";

export type TaskUrgency = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskType =
  | "Immediate Rescue / Evacuation Assessment"
  | "Structural Safety / Rescue Assessment"
  | "Priority Welfare Check / Inspection"
  | "Monitoring / Routine Assessment";

export interface IRescueTask extends Document {
  taskId: string;
  sceneId: string;
  buildingId: number;
  location: {
    centroidX: number;
    centroidY: number;
    latitude: number;
    longitude: number;
    areaPixels: number;
  };
  riskScore: number;
  riskCategory: "Critical" | "High" | "Moderate" | "Low";
  floodExposure: number;
  damageSeverity: number;
  taskType: TaskType;
  urgency: TaskUrgency;
  taskReason: string;
  requiredResources: string[];
  estimatedPersonnel: string;
  taskStatus: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RescueTaskSchema = new Schema<IRescueTask>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
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
      index: true,
    },
    location: {
      centroidX: { type: Number, required: true },
      centroidY: { type: Number, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      areaPixels: { type: Number, required: true },
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    riskCategory: {
      type: String,
      enum: ["Critical", "High", "Moderate", "Low"],
      required: true,
    },
    floodExposure: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    damageSeverity: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    taskType: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      required: true,
      index: true,
    },
    taskReason: {
      type: String,
      required: true,
    },
    requiredResources: [
      {
        type: String,
        required: true,
      },
    ],
    estimatedPersonnel: {
      type: String,
      required: true,
    },
    taskStatus: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RescueTask = mongoose.model<IRescueTask>("RescueTask", RescueTaskSchema);
