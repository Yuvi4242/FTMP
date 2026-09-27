import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, 'id'> {
  _id: string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    preferences: {
      soloDwellerMode: { type: Boolean, default: true },
      dietaryRestrictions: { type: [String], default: ['High Protein'] },
      cookingSkill: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
      maxCookTimeMinutes: { type: Number, default: 30 },
      spiceTolerance: { type: String, enum: ['None', 'Mild', 'Medium', 'Spicy'], default: 'Medium' },
      defaultServings: { type: Number, default: 1 },
    },
    notifications: {
      sameDayExpiry: { type: Boolean, default: true },
      twoDayWarning: { type: Boolean, default: true },
      recipeRescue: { type: Boolean, default: true },
      dinnerPrompt: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
      pushEnabled: { type: Boolean, default: true },
      emailDigest: { type: Boolean, default: false },
      quietHoursStart: { type: String, default: '22:00' },
      quietHoursEnd: { type: String, default: '07:00' },
    },
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
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
