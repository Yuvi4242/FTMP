import mongoose, { Schema } from 'mongoose';
import { IInventoryItem } from '../types';

export interface IInventoryItemDocument extends Omit<IInventoryItem, 'id'> {
  _id: string;
}

const InventoryItemSchema = new Schema<IInventoryItemDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 1 },
    unit: { type: String, required: true, default: 'pcs' },
    category: {
      type: String,
      enum: ['Meat & Poultry', 'Dairy & Eggs', 'Produce', 'Pantry Staples', 'Bakery', 'Frozen', 'Other'],
      default: 'Produce',
    },
    storageLocation: {
      type: String,
      enum: ['Main Shelf', 'Crisper Drawer', 'Freezer Door', 'Pantry', 'Fridge Door'],
      default: 'Main Shelf',
    },
    purchaseDate: { type: String, default: () => new Date().toISOString() },
    expiryDate: { type: String, required: true },
    expiryStatus: {
      type: String,
      enum: ['critical', 'soon', 'fresh'],
      default: 'fresh',
    },
    daysUntilExpiry: { type: Number, required: true, default: 7 },
    addedViaScan: { type: Boolean, default: false },
    imageUrl: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
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

InventoryItemSchema.index({ userId: 1, expiryDate: 1 });

export const InventoryItemModel = mongoose.model<IInventoryItemDocument>('InventoryItem', InventoryItemSchema);
