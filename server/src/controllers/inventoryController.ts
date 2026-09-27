import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DBService } from '../services/dbService';
import { IInventoryItem } from '../types';
import { AuthRequest } from '../middleware/auth';

const calculateExpiryStatus = (expiryDateStr: string): { status: 'critical' | 'soon' | 'fresh'; days: number } => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { status: 'critical', days: 0 };
  if (diffDays <= 3) return { status: 'soon', days: diffDays };
  return { status: 'fresh', days: diffDays };
};

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    let items = await DBService.getInventory(userId);

    // Refresh dynamic expiry calculations
    items = items.map((item) => {
      const exp = calculateExpiryStatus(item.expiryDate);
      return {
        ...item,
        expiryStatus: exp.status,
        daysUntilExpiry: exp.days,
      };
    });

    if (category && category !== 'All') {
      if (category === 'Fridge') {
        items = items.filter(
          (i) => i.storageLocation === 'Main Shelf' || i.storageLocation === 'Crisper Drawer' || i.storageLocation === 'Fridge Door'
        );
      } else if (category === 'Freezer') {
        items = items.filter((i) => i.storageLocation === 'Freezer Door');
      } else if (category === 'Pantry') {
        items = items.filter((i) => i.storageLocation === 'Pantry');
      }
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s));
    }

    // Sort: Critical first, then soon, then fresh
    items.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    res.json({
      count: items.length,
      items,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInventorySummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const items = await DBService.getInventory(userId);

    let criticalCount = 0;
    let soonCount = 0;
    let freshCount = 0;

    items.forEach((item) => {
      const exp = calculateExpiryStatus(item.expiryDate);
      if (exp.status === 'critical') criticalCount++;
      else if (exp.status === 'soon') soonCount++;
      else freshCount++;
    });

    res.json({
      total: items.length,
      criticalCount,
      soonCount,
      freshCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { name, quantity, unit, category, storageLocation, expiryDate, imageUrl } = req.body;

    if (!name || quantity === undefined) {
      res.status(400).json({ error: 'Name and quantity are required.' });
      return;
    }

    const expDate = expiryDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    const exp = calculateExpiryStatus(expDate);

    const newItem: IInventoryItem = {
      id: uuidv4(),
      userId,
      name,
      quantity: Number(quantity),
      unit: unit || 'pcs',
      category: category || 'Pantry Staples',
      storageLocation: storageLocation || 'Main Shelf',
      purchaseDate: new Date().toISOString(),
      expiryDate: expDate,
      expiryStatus: exp.status,
      daysUntilExpiry: exp.days,
      addedViaScan: false,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await DBService.saveInventoryItem(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await DBService.getInventoryItem(id);

    if (!existing) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const updates = req.body;
    let updatedExpiryDate = updates.expiryDate || existing.expiryDate;
    const exp = calculateExpiryStatus(updatedExpiryDate);

    const updatedItem: IInventoryItem = {
      ...existing,
      ...updates,
      expiryDate: updatedExpiryDate,
      expiryStatus: exp.status,
      daysUntilExpiry: exp.days,
      updatedAt: new Date().toISOString(),
    };

    await DBService.saveInventoryItem(updatedItem);
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const success = await DBService.deleteInventoryItem(id);
    if (!success) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
