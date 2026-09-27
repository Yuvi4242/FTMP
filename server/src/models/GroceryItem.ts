import mongoose, { Schema } from 'mongoose';
import { IGroceryItem } from '../types';

export interface IGroceryItemDocument extends Omit<IGroceryItem, 'id'> {
  _id: string;
}

const GroceryItemSchema = new Schema<IGroceryItemDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, default: '1' },
    category: {
      type: String,
      enum: ['Dairy & Refrigerated', 'Produce', 'Pantry', 'Meat & Seafood', 'Other'],
      default: 'Produce',
    },
    aisle: { type: String },
    isPurchased: { type: Boolean, default: false },
    forRecipeTitle: { type: String },
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

GroceryItemSchema.index({ userId: 1, isPurchased: 1 });

export const GroceryItemModel = mongoose.model<IGroceryItemDocument>('GroceryItem', GroceryItemSchema);
