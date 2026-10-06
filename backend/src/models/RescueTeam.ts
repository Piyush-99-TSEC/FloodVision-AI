import mongoose, { Schema, Document } from "mongoose";

export type TeamType =
  | "RESCUE_TEAM"
  | "BOAT_TEAM"
  | "DRONE_TEAM"
  | "MEDICAL_TEAM"
  | "STRUCTURAL_TEAM"
  | "HEAVY_EQUIPMENT_TEAM";

export type TeamStatus = "AVAILABLE" | "ASSIGNED" | "BUSY" | "COMPLETED";

export interface IRescueTeam extends Document {
  teamId: string;
  teamName: string;
  teamType: TeamType;
  currentLocation: {
    latitude: number;
    longitude: number;
    areaName: string;
  };
  available: boolean;
  personnelCount: number;
  capabilities: string[];
  status: TeamStatus;
  assignedTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RescueTeamSchema = new Schema<IRescueTeam>(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    teamType: {
      type: String,
      enum: [
        "RESCUE_TEAM",
        "BOAT_TEAM",
        "DRONE_TEAM",
        "MEDICAL_TEAM",
        "STRUCTURAL_TEAM",
        "HEAVY_EQUIPMENT_TEAM",
      ],
      required: true,
      index: true,
    },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      areaName: { type: String, required: true },
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    personnelCount: {
      type: Number,
      required: true,
      min: 1,
    },
    capabilities: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["AVAILABLE", "ASSIGNED", "BUSY", "COMPLETED"],
      default: "AVAILABLE",
      required: true,
      index: true,
    },
    assignedTaskId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const RescueTeam = mongoose.model<IRescueTeam>("RescueTeam", RescueTeamSchema);
