import { create } from 'zustand';
import apiClient from '../api/client';
import { IRecipe } from '../types';

interface RecipeState {
  recipes: IRecipe[];
  selectedRecipe: IRecipe | null;
  activeFilter: string; // 'All' | '100% Ready' | 'Use Expiring First' | 'Under 20 min'
  currentServings: number;
  activeCookingStep: number;
  activeTimerSeconds: number;
  isTimerRunning: boolean;
  isLoading: boolean;
  error: string | null;

  fetchRecipes: () => Promise<void>;
  selectRecipe: (recipe: IRecipe) => void;
  setActiveFilter: (filter: string) => void;
  scaleServings: (servings: number) => void;
  setCookingStep: (stepIndex: number) => void;
  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  decrementTimer: () => void;
  logMealCooked: (recipeId: string, servings: number) => Promise<void>;
}

const DEFAULT_RECIPES: IRecipe[] = [
  {
    id: 'recipe-1',
    title: 'Garlic Butter Chicken & Crispy Greens',
    description: 'Ultra-fast pan-seared chicken breast basted in garlic butter and served over wilted fresh baby spinach.',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 480,
    macros: { protein: '46g', carbs: '6g', fat: '28g' },
    difficulty: 'Beginner',
    matchPercentage: 100,
    missingCount: 0,
    usesExpiringCount: 2,
    ingredients: [
      { name: 'Chicken Breast', amount: '250g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: true },
      { name: 'Baby Spinach', amount: '2 cups', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: true },
      { name: 'Butter', amount: '1 tbsp', inStock: true, storageLocation: 'Fridge Door', isExpiringSoon: false },
      { name: 'Garlic Cloves', amount: '2 minced', inStock: true, storageLocation: 'Pantry', isExpiringSoon: false },
    ],
    equipmentNeeded: ['Non-stick skillet', 'Tongs', 'Chef knife'],
    instructions: [
      {
        step: 1,
        title: 'Prep & Season',
        description: 'Pat chicken breast dry with a paper towel. Season both sides with salt and freshly cracked black pepper.',
        timerSeconds: 120,
        chefTip: 'Drying the surface ensures a golden crisp sear instead of steaming.',
        neededIngredients: ['Chicken Breast'],
      },
      {
        step: 2,
        title: 'Pan Sear Chicken',
        description: 'Heat 1 tbsp butter and olive oil in skillet over medium-high heat. Place chicken down and sear undisturbed.',
        timerSeconds: 360,
        chefTip: 'Do not move the chicken during the first 6 minutes to form a caramelized crust.',
        neededIngredients: ['Chicken Breast', 'Butter'],
      },
      {
        step: 3,
        title: 'Baste & Flip',
        description: 'Flip chicken, add crushed garlic cloves, and spoon melted foaming garlic butter over the breast.',
        timerSeconds: 300,
        chefTip: 'Tilt skillet slightly toward you to gather the butter for easy spooning.',
        neededIngredients: ['Garlic Cloves', 'Butter'],
      },
      {
        step: 4,
        title: 'Wilt Baby Spinach',
        description: 'Remove chicken to rest. Toss baby spinach straight into the garlic butter pan for 90 seconds until bright green and tender.',
        timerSeconds: 90,
        chefTip: 'Spinach wilts rapidly; pull off heat immediately once collapsed.',
        neededIngredients: ['Baby Spinach'],
      },
    ],
  },
  {
    id: 'recipe-2',
    title: 'Quick Spinach & Egg Scramble',
    description: 'Protein-packed 10-minute breakfast skillet utilizing expiring baby spinach and farm eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    servings: 1,
    calories: 310,
    macros: { protein: '22g', carbs: '4g', fat: '21g' },
    difficulty: 'Beginner',
    matchPercentage: 100,
    missingCount: 0,
    usesExpiringCount: 1,
    ingredients: [
      { name: 'Eggs (Large)', amount: '3 eggs', inStock: true, storageLocation: 'Fridge Door', isExpiringSoon: false },
      { name: 'Baby Spinach', amount: '1.5 cups', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: true },
      { name: 'Feta Cheese', amount: '30g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: false },
    ],
    equipmentNeeded: ['Small frying pan', 'Silicone spatula', 'Fork'],
    instructions: [
      {
        step: 1,
        title: 'Whisk Eggs',
        description: 'Whisk 3 eggs with a pinch of salt until smooth and aerated.',
        timerSeconds: 60,
        chefTip: 'Whisk vigorously to incorporate air for a fluffier texture.',
        neededIngredients: ['Eggs (Large)'],
      },
      {
        step: 2,
        title: 'Wilt Spinach',
        description: 'Toss spinach in lightly oiled warm pan until just wilted.',
        timerSeconds: 60,
        neededIngredients: ['Baby Spinach'],
      },
      {
        step: 3,
        title: 'Fold Soft Curds',
        description: 'Pour whisked eggs into pan over low heat. Gently fold into soft curds and top with crumbled feta.',
        timerSeconds: 180,
        chefTip: 'Keep heat low to avoid dry or rubbery eggs.',
        neededIngredients: ['Eggs (Large)', 'Feta Cheese'],
      },
    ],
  },
  {
    id: 'recipe-3',
    title: 'High-Protein Greek Yogurt Berry Parfait',
    description: 'Zero-cooking high protein breakfast or post-workout fuel with crunchy rolled oats.',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 340,
    macros: { protein: '26g', carbs: '42g', fat: '6g' },
    difficulty: 'Beginner',
    matchPercentage: 100,
    missingCount: 0,
    usesExpiringCount: 1,
    ingredients: [
      { name: 'Greek Yogurt', amount: '200g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: true },
      { name: 'Rolled Oats', amount: '40g', inStock: true, storageLocation: 'Pantry', isExpiringSoon: false },
      { name: 'Frozen Mixed Berries', amount: '80g', inStock: true, storageLocation: 'Freezer Door', isExpiringSoon: false },
    ],
    equipmentNeeded: ['Bowl or mason jar', 'Spoon'],
    instructions: [
      {
        step: 1,
        title: 'Layer Yogurt',
        description: 'Spoon thick Greek yogurt into a glass or bowl.',
        neededIngredients: ['Greek Yogurt'],
      },
      {
        step: 2,
        title: 'Top & Enjoy',
        description: 'Top with rolled oats and warmed or thawed mixed berries.',
        neededIngredients: ['Rolled Oats', 'Frozen Mixed Berries'],
      },
    ],
  },
  {
    id: 'recipe-4',
    title: 'One-Pan Bell Pepper & Feta Skillet',
    description: 'Vibrant Mediterranean skillet with blistered sweet peppers, molten feta, and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 290,
    macros: { protein: '14g', carbs: '18g', fat: '17g' },
    difficulty: 'Beginner',
    matchPercentage: 90,
    missingCount: 1,
    usesExpiringCount: 1,
    ingredients: [
      { name: 'Bell Peppers', amount: '2 sliced', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: false },
      { name: 'Feta Cheese Block', amount: '60g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: false },
      { name: 'Olive Oil', amount: '1 tbsp', inStock: true, storageLocation: 'Pantry', isExpiringSoon: false },
      { name: 'Fresh Basil', amount: 'handful', inStock: false, isExpiringSoon: false },
    ],
    equipmentNeeded: ['Skillet', 'Wooden spoon'],
    instructions: [
      {
        step: 1,
        title: 'Blister Peppers',
        description: 'Sauté sliced bell peppers in olive oil over medium-high heat until edges get golden char marks.',
        timerSeconds: 420,
        neededIngredients: ['Bell Peppers', 'Olive Oil'],
      },
      {
        step: 2,
        title: 'Melt Feta',
        description: 'Push peppers to the edges, place feta in center, cover pan for 3 minutes until cheese softens and glistens.',
        timerSeconds: 180,
        neededIngredients: ['Feta Cheese Block'],
      },
    ],
  },
  {
    id: 'recipe-5',
    title: 'Pan-Seared Salmon & Crisp Asparagus',
    description: 'Crispy skin salmon fillet with lemon butter pan sauce and charred greens.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 420,
    macros: { protein: '38g', carbs: '5g', fat: '26g' },
    difficulty: 'Intermediate',
    matchPercentage: 85,
    missingCount: 1,
    usesExpiringCount: 1,
    ingredients: [
      { name: 'Salmon Fillet', amount: '200g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: true },
      { name: 'Asparagus', amount: '6 spears', inStock: false, isExpiringSoon: false },
      { name: 'Butter', amount: '1 tbsp', inStock: true, storageLocation: 'Fridge Door', isExpiringSoon: false },
      { name: 'Lemon', amount: '1/2', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: false },
    ],
    equipmentNeeded: ['Stainless steel skillet', 'Fish spatula'],
    instructions: [
      {
        step: 1,
        title: 'Crisp the Skin',
        description: 'Sear salmon skin-side down in hot oil for 5 minutes without disturbing.',
        timerSeconds: 300,
        neededIngredients: ['Salmon Fillet'],
      },
      {
        step: 2,
        title: 'Butter Baste',
        description: 'Flip, add butter and squeeze lemon juice over fillet until just cooked through.',
        timerSeconds: 180,
        neededIngredients: ['Butter', 'Lemon'],
      },
    ],
  },
];

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: DEFAULT_RECIPES,
  selectedRecipe: DEFAULT_RECIPES[0],
  activeFilter: 'All',
  currentServings: 1,
  activeCookingStep: 0,
  activeTimerSeconds: 0,
  isTimerRunning: false,
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/recipes/recommendations');
      if (response.data && response.data.recipes) {
        set({
          recipes: response.data.recipes,
          selectedRecipe: response.data.recipes[0] || get().selectedRecipe,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  selectRecipe: (recipe: IRecipe) => {
    set({
      selectedRecipe: recipe,
      currentServings: recipe.servings || 1,
      activeCookingStep: 0,
      activeTimerSeconds: recipe.instructions[0]?.timerSeconds || 0,
      isTimerRunning: false,
    });
  },

  setActiveFilter: (filter: string) => {
    set({ activeFilter: filter });
  },

  scaleServings: (servings: number) => {
    const active = get().selectedRecipe;
    if (!active) return;
    const factor = servings / (active.servings || 1);
    const scaled: IRecipe = {
      ...active,
      servings,
      calories: Math.round(active.calories * factor),
      ingredients: active.ingredients.map((ing) => {
        const match = ing.amount.match(/^([\d./]+)\s*(.*)$/);
        if (match) {
          const val = parseFloat(match[1]) * factor;
          return {
            ...ing,
            amount: `${val % 1 === 0 ? val : val.toFixed(1)} ${match[2]}`.trim(),
          };
        }
        return ing;
      }),
    };
    set({ currentServings: servings, selectedRecipe: scaled });
  },

  setCookingStep: (stepIndex: number) => {
    const active = get().selectedRecipe;
    const nextTimer = active?.instructions[stepIndex]?.timerSeconds || 0;
    set({
      activeCookingStep: stepIndex,
      activeTimerSeconds: nextTimer,
      isTimerRunning: false,
    });
  },

  startTimer: (seconds: number) => {
    set({ activeTimerSeconds: seconds, isTimerRunning: true });
  },

  pauseTimer: () => {
    set({ isTimerRunning: false });
  },

  resumeTimer: () => {
    if (get().activeTimerSeconds > 0) {
      set({ isTimerRunning: true });
    }
  },

  resetTimer: () => {
    const active = get().selectedRecipe;
    const step = get().activeCookingStep;
    const origSeconds = active?.instructions[step]?.timerSeconds || 0;
    set({ activeTimerSeconds: origSeconds, isTimerRunning: false });
  },

  decrementTimer: () => {
    const current = get().activeTimerSeconds;
    if (current > 1) {
      set({ activeTimerSeconds: current - 1 });
    } else {
      set({ activeTimerSeconds: 0, isTimerRunning: false });
    }
  },

  logMealCooked: async (recipeId: string, servings: number) => {
    try {
      await apiClient.post('/meals/cook', { recipeId, servingsCooked: servings });
    } catch (err) {
      // Handled silently
    }
  },
}));
