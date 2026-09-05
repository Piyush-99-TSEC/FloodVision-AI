import mongoose, { Schema, Document } from "mongoose";

export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface IFactor {
  label: string;
  weight: number;
}

export interface IRescuePriority extends Document {
  _id: mongoose.Types.ObjectId;
  assessmentId: string;
  area: string;
  score: number;
  priorityLevel: PriorityLevel;
  factors: IFactor[];
  createdAt: Date;
  updatedAt: Date;
}

const RescuePrioritySchema = new Schema<IRescuePriority>(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    area: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    priorityLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      required: true,
    },
    factors: [
      {
        label: { type: String, required: true },
        weight: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const RescuePriority = mongoose.model<IRescuePriority>("RescuePriority", RescuePrioritySchema);
