import mongoose, { Schema } from 'mongoose';
import { IDetectedIngredient } from '../types';

export interface IScanLogDocument {
  _id: string;
  userId: string;
  imageUrl?: string;
  detectedCount: number;
  ingredients: IDetectedIngredient[];
  confidenceSummary?: {
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  };
  createdAt: string;
}

const ScanLogSchema = new Schema<IScanLogDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String },
    detectedCount: { type: Number, required: true, default: 0 },
    ingredients: { type: Schema.Types.Mixed, default: [] },
    confidenceSummary: {
      type: Schema.Types.Mixed,
      default: { highConfidence: 0, mediumConfidence: 0, lowConfidence: 0 },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ScanLogModel = mongoose.model<IScanLogDocument>('ScanLog', ScanLogSchema);
