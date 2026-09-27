import mongoose, { Schema } from 'mongoose';
import { IMealHistory } from '../types';

export interface IMealHistoryDocument extends Omit<IMealHistory, 'id'> {
  _id: string;
}

const MealHistorySchema = new Schema<IMealHistoryDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    recipeId: { type: String, required: true },
    recipeTitle: { type: String, required: true },
    cookedAt: { type: String, default: () => new Date().toISOString() },
    servingsCooked: { type: Number, required: true, default: 1 },
    cookTimeMinutes: { type: Number, required: true, default: 20 },
    calories: { type: Number, required: true, default: 450 },
    ingredientsRescuedCount: { type: Number, required: true, default: 1 },
    estimatedSavingsUsd: { type: Number, required: true, default: 4.5 },
    zeroWasteBadge: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
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

MealHistorySchema.index({ userId: 1, cookedAt: -1 });

export const MealHistoryModel = mongoose.model<IMealHistoryDocument>('MealHistory', MealHistorySchema);
