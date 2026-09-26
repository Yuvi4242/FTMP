import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store';
import { IGroceryItem, IInventoryItem } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getGroceryList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const items = Array.from(store.grocery.values()).filter((g) => g.userId === userId);

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

    store.grocery.set(newItem.id, newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const togglePurchased = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const item = store.grocery.get(id);

    if (!item) {
      res.status(404).json({ error: 'Grocery item not found' });
      return;
    }

    const updated = {
      ...item,
      isPurchased: !item.isPurchased,
    };

    store.grocery.set(id, updated);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addCheckedToPantry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const items = Array.from(store.grocery.values()).filter((g) => g.userId === userId && g.isPurchased);

    const now = new Date();
    const addedToPantry: IInventoryItem[] = [];

    items.forEach((item) => {
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

      store.inventory.set(newPantryItem.id, newPantryItem);
      addedToPantry.push(newPantryItem);
      // Remove from grocery list
      store.grocery.delete(item.id);
    });

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
    const deleted = store.grocery.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Grocery item deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
