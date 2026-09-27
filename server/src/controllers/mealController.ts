import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DBService } from '../services/dbService';
import { IMealHistory } from '../types';
import { AuthRequest } from '../middleware/auth';

export const logMealCooked = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { recipeId, servingsCooked = 1, notes, rating } = req.body;

    const recipe = recipeId ? await DBService.getRecipeById(recipeId) : null;
    const title = recipe ? recipe.title : 'Custom Home Cooked Meal';
    const cookTime = recipe ? recipe.cookTimeMinutes : 15;
    const calories = recipe ? recipe.calories : 450;
    const rescued = recipe ? recipe.usesExpiringCount : 1;
    const savings = rescued * 4.25;

    const newRecord: IMealHistory = {
      id: uuidv4(),
      userId,
      recipeId: recipeId || 'custom',
      recipeTitle: title,
      cookedAt: new Date().toISOString(),
      servingsCooked: Number(servingsCooked),
      cookTimeMinutes: cookTime,
      calories,
      ingredientsRescuedCount: rescued,
      estimatedSavingsUsd: savings,
      zeroWasteBadge: rescued > 0,
      notes,
      rating,
    };

    await DBService.saveMealHistory(newRecord);

    // Automatically decrement/consume items in inventory if matching ingredients exist
    if (recipe) {
      const inventory = await DBService.getInventory(userId);
      for (const ing of recipe.ingredients) {
        const match = inventory.find((item) => item.name.toLowerCase().includes(ing.name.toLowerCase()));
        if (match) {
          if (match.quantity <= 1) {
            await DBService.deleteInventoryItem(match.id);
          } else {
            await DBService.saveInventoryItem({
              ...match,
              quantity: Math.max(0, match.quantity - 1),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    res.status(201).json({
      message: 'Meal successfully logged! Inventory updated.',
      meal: newRecord,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMealHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const history = await DBService.getMealHistory(userId);

    // Calculate aggregated impact stats
    const totalMeals = history.length;
    const itemsRescued = history.reduce((acc, curr) => acc + curr.ingredientsRescuedCount, 0);
    const moneySaved = history.reduce((acc, curr) => acc + curr.estimatedSavingsUsd, 0);

    res.json({
      totalMeals,
      itemsRescued,
      moneySaved: Math.round(moneySaved * 100) / 100,
      history,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
