import { Response } from 'express';
import { store } from '../services/store';
import { AIService } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';
import { IRecipe } from '../types';

export const getRecommendedRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const filter = req.query.filter as string | undefined;

    const user = store.users.get(userId);
    const preferences = user?.preferences || {
      soloDwellerMode: true,
      dietaryRestrictions: ['High Protein'],
      cookingSkill: 'Intermediate',
      maxCookTimeMinutes: 30,
      spiceTolerance: 'Medium',
      defaultServings: 1,
    };

    const inventory = Array.from(store.inventory.values()).filter((i) => i.userId === userId);

    let recipes = Array.from(store.recipes.values());

    // Dynamically generate AI recipes if store has fewer than 3
    if (recipes.length < 3) {
      const aiGenerated = await AIService.generatePersonalizedRecipes(inventory, preferences);
      aiGenerated.forEach((r) => store.recipes.set(r.id, r));
      recipes = Array.from(store.recipes.values());
    }

    // Apply filters
    if (filter === '100% Ready') {
      recipes = recipes.filter((r) => r.matchPercentage === 100);
    } else if (filter === 'Use Expiring First') {
      recipes = recipes.filter((r) => r.usesExpiringCount > 0);
    } else if (filter === 'Under 20 min') {
      recipes = recipes.filter((r) => r.cookTimeMinutes <= 20);
    }

    // Prioritize recipes using expiring items first, then higher match percentage
    recipes.sort((a, b) => {
      if (b.usesExpiringCount !== a.usesExpiringCount) {
        return b.usesExpiringCount - a.usesExpiringCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });

    res.json({
      count: recipes.length,
      recipes,
      expiringPriorityBanner: {
        active: true,
        message: 'Prioritizing recipes that use Chicken Breast (expires today) and Spinach (2 days left)',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const recipe = store.recipes.get(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const scaleRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const targetServings = Number(req.body.servings) || 1;

    const recipe = store.recipes.get(id);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const scaleFactor = targetServings / recipe.servings;

    // Scale recipe quantities
    const scaledRecipe: IRecipe = {
      ...recipe,
      servings: targetServings,
      calories: Math.round(recipe.calories * scaleFactor),
      macros: {
        protein: `${Math.round(parseInt(recipe.macros.protein) * scaleFactor)}g`,
        carbs: `${Math.round(parseInt(recipe.macros.carbs) * scaleFactor)}g`,
        fat: `${Math.round(parseInt(recipe.macros.fat) * scaleFactor)}g`,
      },
      ingredients: recipe.ingredients.map((ing) => {
        // Simple numeric scaling heuristic
        const match = ing.amount.match(/^([\d./]+)\s*(.*)$/);
        if (match) {
          const num = parseFloat(match[1]) * scaleFactor;
          return {
            ...ing,
            amount: `${num % 1 === 0 ? num : num.toFixed(1)} ${match[2]}`.trim(),
          };
        }
        return ing;
      }),
    };

    res.json(scaledRecipe);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
