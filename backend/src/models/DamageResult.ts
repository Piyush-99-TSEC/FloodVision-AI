import mongoose, { Schema, Document } from "mongoose";

export interface IDamageClasses {
  noDamage: number;
  minor: number;
  major: number;
  destroyed: number;
}

export interface IDamageResult extends Document {
  _id: mongoose.Types.ObjectId;
  assessmentId: string;
  floodPercentage: number;
  affectedBuildings: number;
  damageClasses: IDamageClasses;
  confidence: number;
  floodMask?: string | object;
  damageOverlay?: string | object;
  createdAt: Date;
  updatedAt: Date;
}

const DamageResultSchema = new Schema<IDamageResult>(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    floodPercentage: {
      type: Number,
      required: true,
    },
    affectedBuildings: {
      type: Number,
      required: true,
    },
    damageClasses: {
      noDamage: { type: Number, default: 0 },
      minor: { type: Number, default: 0 },
      major: { type: Number, default: 0 },
      destroyed: { type: Number, default: 0 },
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    floodMask: {
      type: Schema.Types.Mixed,
      default: null,
    },
    damageOverlay: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const DamageResult = mongoose.model<IDamageResult>("DamageResult", DamageResultSchema);
