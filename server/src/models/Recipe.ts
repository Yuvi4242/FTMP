import mongoose, { Schema } from 'mongoose';
import { IRecipe } from '../types';

export interface IRecipeDocument extends Omit<IRecipe, 'id'> {
  _id: string;
}

const RecipeIngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: String, required: true },
    inStock: { type: Boolean, default: false },
    storageLocation: { type: String },
    isExpiringSoon: { type: Boolean, default: false },
  },
  { _id: false }
);

const RecipeInstructionSchema = new Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timerSeconds: { type: Number },
    chefTip: { type: String },
    neededIngredients: { type: [String], default: [] },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipeDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    prepTimeMinutes: { type: Number, required: true, default: 10 },
    cookTimeMinutes: { type: Number, required: true, default: 15 },
    servings: { type: Number, required: true, default: 1 },
    calories: { type: Number, required: true, default: 400 },
    macros: {
      protein: { type: String, default: '20g' },
      carbs: { type: String, default: '30g' },
      fat: { type: String, default: '15g' },
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    matchPercentage: { type: Number, default: 100 },
    missingCount: { type: Number, default: 0 },
    usesExpiringCount: { type: Number, default: 0 },
    ingredients: { type: [RecipeIngredientSchema], default: [] },
    equipmentNeeded: { type: [String], default: [] },
    instructions: { type: [RecipeInstructionSchema], default: [] },
    imageUrl: { type: String },
    isFavorite: { type: Boolean, default: false },
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

export const RecipeModel = mongoose.model<IRecipeDocument>('Recipe', RecipeSchema);
