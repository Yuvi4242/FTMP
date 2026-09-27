import { Response } from 'express';
import { DBService } from '../services/dbService';
import { AIService } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';
import { IRecipe } from '../types';

export const getRecommendedRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const filter = req.query.filter as string | undefined;

    const user = await DBService.getUserById(userId);
    const preferences = user?.preferences || {
      soloDwellerMode: true,
      dietaryRestrictions: ['High Protein'],
      cookingSkill: 'Intermediate',
      maxCookTimeMinutes: 30,
      spiceTolerance: 'Medium',
      defaultServings: 1,
    };

    const inventory = await DBService.getInventory(userId);
    let recipes = await DBService.getRecipes(userId);

    // If store has fewer than 3 recipes, generate AI recipes
    if (recipes.length < 3) {
      const aiGenerated = await AIService.generatePersonalizedRecipes(inventory, preferences);
      for (const r of aiGenerated) {
        await DBService.saveRecipe(r);
      }
      recipes = await DBService.getRecipes(userId);
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

    const expiringItems = inventory.filter((i) => i.daysUntilExpiry <= 2);
    const expiringMessage =
      expiringItems.length > 0
        ? `Prioritizing recipes that use ${expiringItems.map((i) => `${i.name} (${i.daysUntilExpiry}d left)`).join(' and ')}`
        : 'Zero food waste active — using all fresh ingredients';

    res.json({
      count: recipes.length,
      recipes,
      expiringPriorityBanner: {
        active: true,
        message: expiringMessage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const recipe = await DBService.getRecipeById(id);

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

    const recipe = await DBService.getRecipeById(id);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const scaleFactor = targetServings / recipe.servings;

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

export const generateCustomRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Please provide a recipe idea or prompt.' });
      return;
    }

    const user = await DBService.getUserById(userId);
    const preferences = user?.preferences || {
      soloDwellerMode: true,
      dietaryRestrictions: ['High Protein'],
      cookingSkill: 'Intermediate',
      maxCookTimeMinutes: 30,
      spiceTolerance: 'Medium',
      defaultServings: 1,
    };

    const inventory = await DBService.getInventory(userId);
    const recipe = await AIService.generateCustomAiRecipe(prompt, inventory, preferences);
    await DBService.saveRecipe(recipe);

    res.status(201).json(recipe);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubstitutions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ingredient = req.query.ingredient as string;
    const recipeTitle = req.query.recipeTitle as string | undefined;

    if (!ingredient) {
      res.status(400).json({ error: 'Please provide an ingredient query parameter.' });
      return;
    }

    const result = await AIService.getChefSubstitutions(ingredient, recipeTitle);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getZeroWasteMealPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'user-alex-1';
    const user = await DBService.getUserById(userId);
    const preferences = user?.preferences || {
      soloDwellerMode: true,
      dietaryRestrictions: ['High Protein'],
      cookingSkill: 'Intermediate',
      maxCookTimeMinutes: 30,
      spiceTolerance: 'Medium',
      defaultServings: 1,
    };

    const inventory = await DBService.getInventory(userId);
    const plan = await AIService.generateZeroWasteMealPlan(inventory, preferences);
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
