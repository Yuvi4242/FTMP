import { getIsMongoConnected } from '../config/db';
import {
  UserModel,
  InventoryItemModel,
  RecipeModel,
  MealHistoryModel,
  GroceryItemModel,
  ScanLogModel,
} from '../models';
import { store } from './store';
import {
  IUser,
  IInventoryItem,
  IRecipe,
  IGroceryItem,
  IMealHistory,
  IScanProcessingResult,
} from '../types';

/**
 * Unified Database Service Layer
 * Supports MongoDB when online, seamlessly falls back to In-Memory store when offline
 */
export class DBService {
  // ==================== USER ====================
  public static async getUserById(userId: string): Promise<IUser | null> {
    if (getIsMongoConnected()) {
      try {
        const doc = await UserModel.findById(userId).lean();
        if (doc) return { ...doc, id: doc._id } as any;
      } catch (err: any) {
        console.warn('[DBService] Mongo getUserById error, using store:', err.message);
      }
    }
    return store.users.get(userId) || null;
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    const normalized = email.toLowerCase().trim();
    if (getIsMongoConnected()) {
      try {
        const doc = await UserModel.findOne({ email: normalized }).lean();
        if (doc) return { ...doc, id: doc._id } as any;
      } catch (err: any) {
        console.warn('[DBService] Mongo getUserByEmail error, using store:', err.message);
      }
    }
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return null;
  }

  public static async saveUser(user: IUser): Promise<IUser> {
    store.users.set(user.id, user);
    if (getIsMongoConnected()) {
      try {
        await UserModel.findByIdAndUpdate(user.id, { ...user, _id: user.id }, { upsert: true, new: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveUser error:', err.message);
      }
    }
    return user;
  }

  // ==================== INVENTORY ====================
  public static async getInventory(userId: string): Promise<IInventoryItem[]> {
    if (getIsMongoConnected()) {
      try {
        const docs = await InventoryItemModel.find({ userId }).sort({ daysUntilExpiry: 1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d) => ({ ...d, id: d._id })) as any;
        }
      } catch (err: any) {
        console.warn('[DBService] Mongo getInventory error, using store:', err.message);
      }
    }
    return Array.from(store.inventory.values()).filter((i) => i.userId === userId || !i.userId);
  }

  public static async getInventoryItem(id: string): Promise<IInventoryItem | null> {
    if (getIsMongoConnected()) {
      try {
        const doc = await InventoryItemModel.findById(id).lean();
        if (doc) return { ...doc, id: doc._id } as any;
      } catch (err: any) {
        console.warn('[DBService] Mongo getInventoryItem error, using store:', err.message);
      }
    }
    return store.inventory.get(id) || null;
  }

  public static async saveInventoryItem(item: IInventoryItem): Promise<IInventoryItem> {
    store.inventory.set(item.id, item);
    if (getIsMongoConnected()) {
      try {
        await InventoryItemModel.findByIdAndUpdate(item.id, { ...item, _id: item.id }, { upsert: true, new: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveInventoryItem error:', err.message);
      }
    }
    return item;
  }

  public static async deleteInventoryItem(id: string): Promise<boolean> {
    const existed = store.inventory.delete(id);
    if (getIsMongoConnected()) {
      try {
        await InventoryItemModel.findByIdAndDelete(id);
        return true;
      } catch (err: any) {
        console.warn('[DBService] Mongo deleteInventoryItem error:', err.message);
      }
    }
    return existed;
  }

  // ==================== RECIPES ====================
  public static async getRecipes(userId?: string): Promise<IRecipe[]> {
    if (getIsMongoConnected()) {
      try {
        const filter = userId ? { $or: [{ userId }, { userId: { $exists: false } }] } : {};
        const docs = await RecipeModel.find(filter).lean();
        if (docs && docs.length > 0) {
          return docs.map((d) => ({ ...d, id: d._id })) as any;
        }
      } catch (err: any) {
        console.warn('[DBService] Mongo getRecipes error, using store:', err.message);
      }
    }
    return Array.from(store.recipes.values());
  }

  public static async getRecipeById(id: string): Promise<IRecipe | null> {
    if (getIsMongoConnected()) {
      try {
        const doc = await RecipeModel.findById(id).lean();
        if (doc) return { ...doc, id: doc._id } as any;
      } catch (err: any) {
        console.warn('[DBService] Mongo getRecipeById error, using store:', err.message);
      }
    }
    return store.recipes.get(id) || null;
  }

  public static async saveRecipe(recipe: IRecipe): Promise<IRecipe> {
    store.recipes.set(recipe.id, recipe);
    if (getIsMongoConnected()) {
      try {
        await RecipeModel.findByIdAndUpdate(recipe.id, { ...recipe, _id: recipe.id }, { upsert: true, new: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveRecipe error:', err.message);
      }
    }
    return recipe;
  }

  // ==================== MEAL HISTORY ====================
  public static async getMealHistory(userId: string): Promise<IMealHistory[]> {
    if (getIsMongoConnected()) {
      try {
        const docs = await MealHistoryModel.find({ userId }).sort({ cookedAt: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d) => ({ ...d, id: d._id })) as any;
        }
      } catch (err: any) {
        console.warn('[DBService] Mongo getMealHistory error, using store:', err.message);
      }
    }
    return Array.from(store.mealHistory.values()).filter((m) => m.userId === userId);
  }

  public static async saveMealHistory(meal: IMealHistory): Promise<IMealHistory> {
    store.mealHistory.set(meal.id, meal);
    if (getIsMongoConnected()) {
      try {
        await MealHistoryModel.findByIdAndUpdate(meal.id, { ...meal, _id: meal.id }, { upsert: true, new: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveMealHistory error:', err.message);
      }
    }
    return meal;
  }

  // ==================== GROCERY ====================
  public static async getGroceryItems(userId: string): Promise<IGroceryItem[]> {
    if (getIsMongoConnected()) {
      try {
        const docs = await GroceryItemModel.find({ userId }).sort({ isPurchased: 1, createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d) => ({ ...d, id: d._id })) as any;
        }
      } catch (err: any) {
        console.warn('[DBService] Mongo getGroceryItems error, using store:', err.message);
      }
    }
    return Array.from(store.grocery.values()).filter((g) => g.userId === userId || !g.userId);
  }

  public static async getGroceryItemById(id: string): Promise<IGroceryItem | null> {
    if (getIsMongoConnected()) {
      try {
        const doc = await GroceryItemModel.findById(id).lean();
        if (doc) return { ...doc, id: doc._id } as any;
      } catch (err: any) {
        console.warn('[DBService] Mongo getGroceryItemById error, using store:', err.message);
      }
    }
    return store.grocery.get(id) || null;
  }

  public static async saveGroceryItem(item: IGroceryItem): Promise<IGroceryItem> {
    store.grocery.set(item.id, item);
    if (getIsMongoConnected()) {
      try {
        await GroceryItemModel.findByIdAndUpdate(item.id, { ...item, _id: item.id }, { upsert: true, new: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveGroceryItem error:', err.message);
      }
    }
    return item;
  }

  public static async deleteGroceryItem(id: string): Promise<boolean> {
    const existed = store.grocery.delete(id);
    if (getIsMongoConnected()) {
      try {
        await GroceryItemModel.findByIdAndDelete(id);
        return true;
      } catch (err: any) {
        console.warn('[DBService] Mongo deleteGroceryItem error:', err.message);
      }
    }
    return existed;
  }

  public static async clearPurchasedGrocery(userId: string): Promise<number> {
    let count = 0;
    for (const [id, item] of store.grocery.entries()) {
      if ((item.userId === userId || !item.userId) && item.isPurchased) {
        store.grocery.delete(id);
        count++;
      }
    }
    if (getIsMongoConnected()) {
      try {
        await GroceryItemModel.deleteMany({ userId, isPurchased: true });
      } catch (err: any) {
        console.warn('[DBService] Mongo clearPurchasedGrocery error:', err.message);
      }
    }
    return count;
  }

  // ==================== SCAN LOG ====================
  public static async saveScanLog(userId: string, scanResult: IScanProcessingResult): Promise<void> {
    if (getIsMongoConnected()) {
      try {
        await ScanLogModel.create({
          _id: scanResult.scanId,
          userId,
          imageUrl: scanResult.imageUrl,
          detectedCount: scanResult.detectedCount,
          ingredients: scanResult.ingredients,
          confidenceSummary: scanResult.confidenceSummary,
          createdAt: new Date().toISOString(),
        });
      } catch (err: any) {
        console.warn('[DBService] Mongo saveScanLog error:', err.message);
      }
    }
  }

  // ==================== SEED MONGODB ====================
  public static async seedMongoIfEmpty(): Promise<void> {
    if (!getIsMongoConnected()) return;
    try {
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.log('[DBService] Seeding initial data to MongoDB...');
        for (const user of store.users.values()) {
          await UserModel.findByIdAndUpdate(user.id, { ...user, _id: user.id }, { upsert: true });
        }
        for (const item of store.inventory.values()) {
          await InventoryItemModel.findByIdAndUpdate(item.id, { ...item, _id: item.id }, { upsert: true });
        }
        for (const recipe of store.recipes.values()) {
          await RecipeModel.findByIdAndUpdate(recipe.id, { ...recipe, _id: recipe.id }, { upsert: true });
        }
        for (const grocery of store.grocery.values()) {
          await GroceryItemModel.findByIdAndUpdate(grocery.id, { ...grocery, _id: grocery.id }, { upsert: true });
        }
        for (const meal of store.mealHistory.values()) {
          await MealHistoryModel.findByIdAndUpdate(meal.id, { ...meal, _id: meal.id }, { upsert: true });
        }
        console.log('[DBService] MongoDB seeded successfully!');
      }
    } catch (err: any) {
      console.warn('[DBService] Seeding MongoDB warning:', err.message);
    }
  }
}
