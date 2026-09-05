import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  _id: mongoose.Types.ObjectId;
  imageId: string;
  caseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    imageId: {
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
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: "image/jpeg",
    },
    size: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Image = mongoose.model<IImage>("Image", ImageSchema);
