import mongoose, { Schema, Document } from "mongoose";

export type CaseStatus = "active" | "assessing" | "reviewed" | "closed";

export interface ILocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface IFloodCase extends Document {
  _id: mongoose.Types.ObjectId;
  caseId: string;
  title: string;
  description: string;
  location: ILocation;
  eventDate: Date;
  status: CaseStatus;
  affectedBuildings: number;
  floodPercentage: number;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const FloodCaseSchema = new Schema<IFloodCase>(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Case title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "assessing", "reviewed", "closed"],
      default: "active",
      index: true,
    },
    affectedBuildings: {
      type: Number,
      default: 0,
    },
    floodPercentage: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FloodCase = mongoose.model<IFloodCase>("FloodCase", FloodCaseSchema);
