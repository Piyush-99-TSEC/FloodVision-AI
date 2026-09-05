import mongoose, { Schema, Document } from "mongoose";

export type AssessmentStatus = "pending" | "processing" | "completed" | "failed";

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId;
  assessmentId: string;
  caseId: string;
  imageId: string;
  status: AssessmentStatus;
  modelVersion: string;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    caseId: {
      type: String,
      required: true,
      index: true,
    },
    imageId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "completed",
    },
    modelVersion: {
      type: String,
      default: "v1.0.0",
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment = mongoose.model<IAssessment>("Assessment", AssessmentSchema);
