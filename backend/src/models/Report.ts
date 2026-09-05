import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reportId: string;
  caseId: string;
  title: string;
  summary: string;
  generatedBy: mongoose.Types.ObjectId | string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
