import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AIService } from '../services/aiService';
import { store } from '../services/store';
import { IInventoryItem, IDetectedIngredient } from '../types';
import { AuthRequest } from '../middleware/auth';

export const processScan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const result = await AIService.analyzeFridgeImage(file?.buffer, file?.mimetype);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Vision scan processing failed' });
  }
};

export const confirmScanIngredients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { confirmedIngredients } = req.body as { confirmedIngredients: IDetectedIngredient[] };

    if (!Array.isArray(confirmedIngredients) || confirmedIngredients.length === 0) {
      res.status(400).json({ error: 'Please provide at least one confirmed ingredient.' });
      return;
    }

    const addedItems: IInventoryItem[] = [];
    const now = new Date();

    for (const item of confirmedIngredients) {
      const days = item.estimatedExpiryDays ?? 7;
      const expiry = new Date(now.getTime() + days * 24 * 3600 * 1000).toISOString();
      const expiryStatus = days <= 0 ? 'critical' : days <= 3 ? 'soon' : 'fresh';

      const newItem: IInventoryItem = {
        id: uuidv4(),
        userId,
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'pcs',
        category: (item.category as any) || 'Produce',
        storageLocation: (item.storageLocation as any) || 'Main Shelf',
        purchaseDate: now.toISOString(),
        expiryDate: expiry,
        expiryStatus,
        daysUntilExpiry: days,
        addedViaScan: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      store.inventory.set(newItem.id, newItem);
      addedItems.push(newItem);
    }

    res.status(201).json({
      message: `Successfully added ${addedItems.length} ingredients to your pantry.`,
      addedCount: addedItems.length,
      items: addedItems,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
