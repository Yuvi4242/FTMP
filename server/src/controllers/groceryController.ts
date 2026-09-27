import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DBService } from '../services/dbService';
import { IGroceryItem, IInventoryItem } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getGroceryList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const items = await DBService.getGroceryItems(userId);

    const pending = items.filter((i) => !i.isPurchased);
    const purchased = items.filter((i) => i.isPurchased);

    res.json({
      totalCount: items.length,
      pendingCount: pending.length,
      purchasedCount: purchased.length,
      pending,
      purchased,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addGroceryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { name, quantity, category, aisle, forRecipeTitle } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Item name is required' });
      return;
    }

    const newItem: IGroceryItem = {
      id: uuidv4(),
      userId,
      name,
      quantity: quantity || '1 unit',
      category: category || 'Pantry',
      aisle: aisle || 'General',
      isPurchased: false,
      forRecipeTitle,
      createdAt: new Date().toISOString(),
    };

    await DBService.saveGroceryItem(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const togglePurchased = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const item = await DBService.getGroceryItemById(id);

    if (!item) {
      res.status(404).json({ error: 'Grocery item not found' });
      return;
    }

    const updated: IGroceryItem = {
      ...item,
      isPurchased: !item.isPurchased,
    };

    await DBService.saveGroceryItem(updated);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addCheckedToPantry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const items = await DBService.getGroceryItems(userId);
    const purchased = items.filter((g) => g.isPurchased);

    const now = new Date();
    const addedToPantry: IInventoryItem[] = [];

    for (const item of purchased) {
      const expDate = new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString();
      const newPantryItem: IInventoryItem = {
        id: uuidv4(),
        userId,
        name: item.name,
        quantity: 1,
        unit: item.quantity,
        category: 'Pantry Staples',
        storageLocation: 'Main Shelf',
        purchaseDate: now.toISOString(),
        expiryDate: expDate,
        expiryStatus: 'fresh',
        daysUntilExpiry: 10,
        addedViaScan: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      await DBService.saveInventoryItem(newPantryItem);
      addedToPantry.push(newPantryItem);
      await DBService.deleteGroceryItem(item.id);
    }

    res.json({
      message: `Transferred ${addedToPantry.length} items to your pantry inventory.`,
      addedCount: addedToPantry.length,
      items: addedToPantry,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGroceryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const success = await DBService.deleteGroceryItem(id);
    if (!success) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Grocery item deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addMissingFromRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { recipeId } = req.body;

    if (!recipeId) {
      res.status(400).json({ error: 'Recipe ID is required.' });
      return;
    }

    const recipe = await DBService.getRecipeById(recipeId);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found.' });
      return;
    }

    const missingIngredients = recipe.ingredients.filter((i) => !i.inStock);
    const added: IGroceryItem[] = [];

    for (const ing of missingIngredients) {
      const newItem: IGroceryItem = {
        id: uuidv4(),
        userId,
        name: ing.name,
        quantity: ing.amount,
        category: 'Pantry',
        aisle: 'Recipe Needed',
        isPurchased: false,
        forRecipeTitle: recipe.title,
        createdAt: new Date().toISOString(),
      };
      await DBService.saveGroceryItem(newItem);
      added.push(newItem);
    }

    res.status(201).json({
      message: `Added ${added.length} missing ingredients to grocery list for ${recipe.title}`,
      items: added,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
