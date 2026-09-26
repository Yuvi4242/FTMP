export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  preferences: IUserPreferences;
  notifications: INotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPreferences {
  soloDwellerMode: boolean;
  dietaryRestrictions: string[];
  cookingSkill: 'Beginner' | 'Intermediate' | 'Advanced';
  maxCookTimeMinutes: number;
  spiceTolerance: 'None' | 'Mild' | 'Medium' | 'Spicy';
  defaultServings: number;
}

export interface INotificationSettings {
  sameDayExpiry: boolean;
  twoDayWarning: boolean;
  recipeRescue: boolean;
  dinnerPrompt: boolean;
  weeklyDigest: boolean;
  pushEnabled: boolean;
  emailDigest: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface IInventoryItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Meat & Poultry' | 'Dairy & Eggs' | 'Produce' | 'Pantry Staples' | 'Bakery' | 'Frozen' | 'Other';
  storageLocation: 'Main Shelf' | 'Crisper Drawer' | 'Freezer Door' | 'Pantry' | 'Fridge Door';
  purchaseDate: string;
  expiryDate: string;
  expiryStatus: 'critical' | 'soon' | 'fresh';
  daysUntilExpiry: number;
  addedViaScan: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDetectedIngredient {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  storageLocation: string;
  estimatedExpiryDays: number;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface IScanProcessingResult {
  scanId: string;
  imageUrl?: string;
  detectedCount: number;
  ingredients: IDetectedIngredient[];
  confidenceSummary: {
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  };
}

export interface IRecipeIngredient {
  name: string;
  amount: string;
  inStock: boolean;
  storageLocation?: string;
  isExpiringSoon?: boolean;
}

export interface IRecipe {
  id: string;
  userId?: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  matchPercentage: number;
  missingCount: number;
  usesExpiringCount: number;
  ingredients: IRecipeIngredient[];
  equipmentNeeded: string[];
  instructions: {
    step: number;
    title: string;
    description: string;
    timerSeconds?: number;
    chefTip?: string;
    neededIngredients: string[];
  }[];
  imageUrl?: string;
}

export interface IGroceryItem {
  id: string;
  userId: string;
  name: string;
  quantity: string;
  category: 'Dairy & Refrigerated' | 'Produce' | 'Pantry' | 'Meat & Seafood' | 'Other';
  aisle?: string;
  isPurchased: boolean;
  forRecipeTitle?: string;
  createdAt: string;
}

export interface IMealHistory {
  id: string;
  userId: string;
  recipeId: string;
  recipeTitle: string;
  cookedAt: string;
  servingsCooked: number;
  cookTimeMinutes: number;
  calories: number;
  ingredientsRescuedCount: number;
  estimatedSavingsUsd: number;
  zeroWasteBadge: boolean;
}
