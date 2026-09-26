import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store';
import { IMealHistory } from '../types';
import { AuthRequest } from '../middleware/auth';

export const logMealCooked = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { recipeId, servingsCooked = 1 } = req.body;

    const recipe = store.recipes.get(recipeId);
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
    };

    store.mealHistory.set(newRecord.id, newRecord);

    // Automatically decrement/consume items in inventory if matching ingredients exist
    if (recipe) {
      recipe.ingredients.forEach((ing) => {
        for (const [id, item] of store.inventory.entries()) {
          if (item.userId === userId && item.name.toLowerCase().includes(ing.name.toLowerCase())) {
            // If quantity <= 1 or near zero, remove from inventory, else reduce
            if (item.quantity <= 1) {
              store.inventory.delete(id);
            } else {
              store.inventory.set(id, {
                ...item,
                quantity: Math.max(0, item.quantity - 1),
                updatedAt: new Date().toISOString(),
              });
            }
            break;
          }
        }
      });
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
    const history = Array.from(store.mealHistory.values())
      .filter((m) => m.userId === userId)
      .sort((a, b) => new Date(b.cookedAt).getTime() - new Date(a.cookedAt).getTime());

    // Calculate aggregated impact stats
    const totalMeals = history.length;
    const itemsRescued = history.reduce((acc, curr) => acc + curr.ingredientsRescuedCount, 0);
    const moneySaved = history.reduce((acc, curr) => acc + curr.estimatedSavingsUsd, 0);

    res.json({
      totalMeals,
      itemsRescued,
      moneySaved: Math.round(moneySaved),
      history,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
