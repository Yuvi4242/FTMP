import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { store } from '../services/store';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const user = store.users.get(userId);

    if (!user) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      data: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const updates = req.body;

    const user = store.users.get(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    user.preferences = {
      ...user.preferences,
      ...updates,
    };
    user.updatedAt = new Date().toISOString();
    store.users.set(userId, user);

    res.json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences: user.preferences,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update preferences' });
  }
};

export const updateNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const updates = req.body;

    const user = store.users.get(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    user.notifications = {
      ...user.notifications,
      ...updates,
    };
    user.updatedAt = new Date().toISOString();
    store.users.set(userId, user);

    res.json({
      success: true,
      message: 'Notification settings updated successfully.',
      notifications: user.notifications,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update notification settings' });
  }
};

export const getWasteStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const meals = Array.from(store.mealHistory.values()).filter((m) => m.userId === userId);
    const inventory = Array.from(store.inventory.values()).filter((i) => i.userId === userId);

    const totalMealsCooked = meals.length;
    const totalIngredientsRescued = meals.reduce((acc, m) => acc + (m.ingredientsRescuedCount || 0), 0);
    const totalSavingsUsd = meals.reduce((acc, m) => acc + (m.estimatedSavingsUsd || 0), 0);
    const zeroWasteMealsCount = meals.filter((m) => m.zeroWasteBadge).length;

    const expiringCritical = inventory.filter((i) => i.expiryStatus === 'critical').length;
    const expiringSoon = inventory.filter((i) => i.expiryStatus === 'soon').length;

    res.json({
      success: true,
      data: {
        totalMealsCooked,
        totalIngredientsRescued,
        totalSavingsUsd: Number(totalSavingsUsd.toFixed(2)),
        zeroWasteMealsCount,
        zeroWasteRate: totalMealsCooked > 0 ? Math.round((zeroWasteMealsCount / totalMealsCooked) * 100) : 100,
        currentPantryHealth: {
          criticalCount: expiringCritical,
          soonCount: expiringSoon,
          totalInStock: inventory.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch waste stats' });
  }
};
