import {
  IUser,
  IInventoryItem,
  IRecipe,
  IGroceryItem,
  IMealHistory,
  IUserPreferences,
  INotificationSettings,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-Memory Database Store for Instant Local Run & Development
class MemoryStore {
  public users: Map<string, IUser> = new Map();
  public inventory: Map<string, IInventoryItem> = new Map();
  public recipes: Map<string, IRecipe> = new Map();
  public grocery: Map<string, IGroceryItem> = new Map();
  public mealHistory: Map<string, IMealHistory> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Default demo user matching the screens designed
    const defaultUserId = 'user-alex-1';
    const defaultUser: IUser = {
      id: defaultUserId,
      name: 'Alex Morgan',
      email: 'alex.morgan@email.com',
      passwordHash: '$2a$10$DEMO_HASH_FOR_ALEX_MORGAN',
      preferences: {
        soloDwellerMode: true,
        dietaryRestrictions: ['High Protein', 'Low Carb'],
        cookingSkill: 'Intermediate',
        maxCookTimeMinutes: 30,
        spiceTolerance: 'Medium',
        defaultServings: 1,
      },
      notifications: {
        sameDayExpiry: true,
        twoDayWarning: true,
        recipeRescue: true,
        dinnerPrompt: true,
        weeklyDigest: false,
        pushEnabled: true,
        emailDigest: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(defaultUserId, defaultUser);

    // Seed pantry items identical to the Stitch screens
    const now = new Date();
    const addDays = (d: Date, days: number) => {
      const res = new Date(d);
      res.setDate(res.getDate() + days);
      return res.toISOString();
    };

    const initialInventory: IInventoryItem[] = [
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Chicken Breast',
        quantity: 500,
        unit: 'g',
        category: 'Meat & Poultry',
        storageLocation: 'Main Shelf',
        purchaseDate: addDays(now, -3),
        expiryDate: now.toISOString(),
        expiryStatus: 'critical',
        daysUntilExpiry: 0,
        addedViaScan: true,
        imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80',
        createdAt: addDays(now, -3),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Fresh Baby Spinach',
        quantity: 1,
        unit: 'bag (200g)',
        category: 'Produce',
        storageLocation: 'Crisper Drawer',
        purchaseDate: addDays(now, -2),
        expiryDate: addDays(now, 2),
        expiryStatus: 'soon',
        daysUntilExpiry: 2,
        addedViaScan: true,
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
        createdAt: addDays(now, -2),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Greek Yogurt',
        quantity: 250,
        unit: 'g',
        category: 'Dairy & Eggs',
        storageLocation: 'Fridge Door',
        purchaseDate: addDays(now, -4),
        expiryDate: addDays(now, 3),
        expiryStatus: 'soon',
        daysUntilExpiry: 3,
        addedViaScan: true,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
        createdAt: addDays(now, -4),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Whole Milk',
        quantity: 1,
        unit: 'gallon',
        category: 'Dairy & Eggs',
        storageLocation: 'Fridge Door',
        purchaseDate: addDays(now, -1),
        expiryDate: addDays(now, 6),
        expiryStatus: 'fresh',
        daysUntilExpiry: 6,
        addedViaScan: true,
        createdAt: addDays(now, -1),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Organic Large Eggs',
        quantity: 12,
        unit: 'pcs',
        category: 'Dairy & Eggs',
        storageLocation: 'Main Shelf',
        purchaseDate: addDays(now, -2),
        expiryDate: addDays(now, 12),
        expiryStatus: 'fresh',
        daysUntilExpiry: 12,
        addedViaScan: true,
        createdAt: addDays(now, -2),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Red Bell Peppers',
        quantity: 2,
        unit: 'pcs',
        category: 'Produce',
        storageLocation: 'Crisper Drawer',
        purchaseDate: addDays(now, -1),
        expiryDate: addDays(now, 5),
        expiryStatus: 'fresh',
        daysUntilExpiry: 5,
        addedViaScan: true,
        createdAt: addDays(now, -1),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Garlic Cloves',
        quantity: 6,
        unit: 'cloves',
        category: 'Pantry Staples',
        storageLocation: 'Pantry',
        purchaseDate: addDays(now, -7),
        expiryDate: addDays(now, 20),
        expiryStatus: 'fresh',
        daysUntilExpiry: 20,
        addedViaScan: false,
        createdAt: addDays(now, -7),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Unsalted Butter',
        quantity: 200,
        unit: 'g',
        category: 'Dairy & Eggs',
        storageLocation: 'Main Shelf',
        purchaseDate: addDays(now, -5),
        expiryDate: addDays(now, 25),
        expiryStatus: 'fresh',
        daysUntilExpiry: 25,
        addedViaScan: false,
        createdAt: addDays(now, -5),
        updatedAt: now.toISOString(),
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        name: 'Extra Virgin Olive Oil',
        quantity: 500,
        unit: 'ml',
        category: 'Pantry Staples',
        storageLocation: 'Pantry',
        purchaseDate: addDays(now, -10),
        expiryDate: addDays(now, 180),
        expiryStatus: 'fresh',
        daysUntilExpiry: 180,
        addedViaScan: false,
        createdAt: addDays(now, -10),
        updatedAt: now.toISOString(),
      },
    ];

    initialInventory.forEach((item) => this.inventory.set(item.id, item));

    // Seed default recipes
    const defaultRecipes: IRecipe[] = [
      {
        id: 'recipe-1',
        title: 'Crispy Garlic Butter Chicken & Spinach',
        description: 'Tender chicken seared with crispy golden skin, basted in melted garlic herb butter and served over wilted fresh spinach.',
        imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        prepTimeMinutes: 5,
        cookTimeMinutes: 15,
        servings: 1,
        calories: 480,
        macros: { protein: '42g', carbs: '6g', fat: '28g' },
        difficulty: 'Intermediate',
        matchPercentage: 100,
        missingCount: 0,
        usesExpiringCount: 2,
        equipmentNeeded: ['Skillet / Frying Pan', 'Chef Knife', 'Tongs'],
        ingredients: [
          { name: 'Boneless chicken breast', amount: '250g', inStock: true, storageLocation: 'Main Shelf', isExpiringSoon: true },
          { name: 'Fresh baby spinach', amount: '2 cups (100g)', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: true },
          { name: 'Garlic', amount: '2 cloves, minced', inStock: true, storageLocation: 'Pantry' },
          { name: 'Olive oil', amount: '1 tbsp', inStock: true, storageLocation: 'Pantry' },
          { name: 'Unsalted butter', amount: '1 tbsp', inStock: true, storageLocation: 'Main Shelf' },
          { name: 'Salt & black pepper', amount: 'To taste', inStock: true, storageLocation: 'Pantry' },
        ],
        instructions: [
          {
            step: 1,
            title: 'Prep and Season',
            description: 'Pat chicken breast dry with a paper towel. Season both sides evenly with coarse salt and freshly cracked black pepper.',
            neededIngredients: ['Boneless chicken breast', 'Salt & black pepper'],
          },
          {
            step: 2,
            title: 'Sear the Chicken Breast',
            description: 'Heat 1 tbsp olive oil in skillet over medium-high heat. Place chicken skin-side down and cook undisturbed for 6 minutes until golden crust forms.',
            timerSeconds: 360,
            chefTip: 'Do not move the chicken during the first 4 minutes to ensure maximum crispiness.',
            neededIngredients: ['Boneless chicken breast', 'Olive oil'],
          },
          {
            step: 3,
            title: 'Butter Baste with Garlic',
            description: 'Flip chicken. Lower heat to medium, drop in butter and minced garlic. Tilt the pan and spoon foaming garlic butter continuously over chicken for 4 minutes.',
            timerSeconds: 240,
            chefTip: 'Keep butter foaming without letting the garlic burn.',
            neededIngredients: ['Unsalted butter', 'Garlic'],
          },
          {
            step: 4,
            title: 'Wilt Spinach and Plate',
            description: 'Transfer chicken to resting plate. Toss washed spinach directly into hot garlic pan butter. Sauté for 60 seconds until glossy and tender. Plate together.',
            timerSeconds: 60,
            neededIngredients: ['Fresh baby spinach'],
          },
        ],
      },
      {
        id: 'recipe-2',
        title: 'Quick Spinach & Egg Scramble',
        description: 'Velvety scrambled eggs folded with sautéed baby spinach and seasoned with sea salt and cracked pepper.',
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
        equipmentNeeded: ['Non-stick Pan', 'Silicone Spatula', 'Small Bowl'],
        ingredients: [
          { name: 'Organic Large Eggs', amount: '3 eggs', inStock: true, storageLocation: 'Main Shelf' },
          { name: 'Fresh baby spinach', amount: '1.5 cups', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: true },
          { name: 'Unsalted butter', amount: '1 tsp', inStock: true, storageLocation: 'Main Shelf' },
          { name: 'Salt & pepper', amount: 'Pinch', inStock: true, storageLocation: 'Pantry' },
        ],
        instructions: [
          {
            step: 1,
            title: 'Beat Eggs',
            description: 'Crack 3 eggs into a bowl with a pinch of salt. Whisk vigorously for 30 seconds.',
            neededIngredients: ['Organic Large Eggs', 'Salt & pepper'],
          },
          {
            step: 2,
            title: 'Wilt Spinach',
            description: 'Melt butter in non-stick pan over medium-low heat. Add spinach and stir until wilted (approx 1 minute).',
            timerSeconds: 60,
            neededIngredients: ['Unsalted butter', 'Fresh baby spinach'],
          },
          {
            step: 3,
            title: 'Slow Scramble',
            description: 'Pour in beaten eggs. Using spatula, gently push eggs from edges to center in slow folds until soft curds form. Remove immediately.',
            timerSeconds: 120,
            neededIngredients: ['Organic Large Eggs'],
          },
        ],
      },
      {
        id: 'recipe-3',
        title: 'Creamy Spinach Garlic Pasta',
        description: 'Rich garlic cream sauce tossed with tender fettuccine pasta and wilted fresh spinach.',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
        prepTimeMinutes: 5,
        cookTimeMinutes: 15,
        servings: 1,
        calories: 520,
        macros: { protein: '18g', carbs: '64g', fat: '24g' },
        difficulty: 'Intermediate',
        matchPercentage: 80,
        missingCount: 1,
        usesExpiringCount: 1,
        equipmentNeeded: ['Pot for boiling', 'Skillet', 'Colander'],
        ingredients: [
          { name: 'Fresh baby spinach', amount: '2 cups', inStock: true, storageLocation: 'Crisper Drawer', isExpiringSoon: true },
          { name: 'Garlic', amount: '3 cloves, sliced', inStock: true, storageLocation: 'Pantry' },
          { name: 'Butter', amount: '1 tbsp', inStock: true, storageLocation: 'Main Shelf' },
          { name: 'Heavy cream', amount: '1/2 cup (120ml)', inStock: false },
          { name: 'Fettuccine or Penne', amount: '90g', inStock: true, storageLocation: 'Pantry' },
        ],
        instructions: [
          {
            step: 1,
            title: 'Boil Pasta',
            description: 'Bring salted water to a boil. Cook pasta according to package (approx 9 mins). Reserve 2 tbsp pasta water.',
            timerSeconds: 540,
            neededIngredients: ['Fettuccine or Penne'],
          },
          {
            step: 2,
            title: 'Make Sauce',
            description: 'Sauté garlic in butter until fragrant. Pour in heavy cream and simmer 2 minutes until slightly reduced.',
            timerSeconds: 120,
            neededIngredients: ['Garlic', 'Butter', 'Heavy cream'],
          },
          {
            step: 3,
            title: 'Combine & Serve',
            description: 'Toss hot pasta and fresh spinach directly into the skillet with reserved pasta water. Stir until spinach wilts and sauce coats pasta.',
            neededIngredients: ['Fresh baby spinach'],
          },
        ],
      },
    ];

    defaultRecipes.forEach((r) => this.recipes.set(r.id, r));

    // Seed grocery list items
    const defaultGrocery: IGroceryItem[] = [
      { id: uuidv4(), userId: defaultUserId, name: 'Heavy Whipping Cream', quantity: '1 cup (240ml)', category: 'Dairy & Refrigerated', aisle: 'Aisle 3', isPurchased: false, forRecipeTitle: 'Creamy Spinach Pasta', createdAt: now.toISOString() },
      { id: uuidv4(), userId: defaultUserId, name: 'Parmesan Cheese Block', quantity: '100g', category: 'Dairy & Refrigerated', aisle: 'Deli', isPurchased: false, createdAt: now.toISOString() },
      { id: uuidv4(), userId: defaultUserId, name: 'Fresh Basil', quantity: '1 bunch', category: 'Produce', aisle: 'Aisle 1', isPurchased: false, createdAt: now.toISOString() },
      { id: uuidv4(), userId: defaultUserId, name: 'Cherry Tomatoes', quantity: '1 pint (250g)', category: 'Produce', aisle: 'Aisle 1', isPurchased: false, createdAt: now.toISOString() },
      { id: uuidv4(), userId: defaultUserId, name: 'Fettuccine Pasta', quantity: '500g box', category: 'Pantry', aisle: 'Aisle 5', isPurchased: false, createdAt: now.toISOString() },
      { id: uuidv4(), userId: defaultUserId, name: 'Garlic cloves', quantity: '3 heads', category: 'Produce', aisle: 'Produce', isPurchased: true, createdAt: addDays(now, -1) },
      { id: uuidv4(), userId: defaultUserId, name: 'Olive oil', quantity: '1 bottle', category: 'Pantry', aisle: 'Pantry', isPurchased: true, createdAt: addDays(now, -1) },
    ];
    defaultGrocery.forEach((g) => this.grocery.set(g.id, g));

    // Seed meal history
    const defaultHistory: IMealHistory[] = [
      {
        id: uuidv4(),
        userId: defaultUserId,
        recipeId: 'recipe-1',
        recipeTitle: 'Crispy Garlic Butter Chicken & Spinach',
        cookedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        servingsCooked: 1,
        cookTimeMinutes: 20,
        calories: 480,
        ingredientsRescuedCount: 2,
        estimatedSavingsUsd: 8.5,
        zeroWasteBadge: true,
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        recipeId: 'recipe-2',
        recipeTitle: 'Quick Spinach & Egg Scramble',
        cookedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        servingsCooked: 1,
        cookTimeMinutes: 10,
        calories: 310,
        ingredientsRescuedCount: 1,
        estimatedSavingsUsd: 4.2,
        zeroWasteBadge: true,
      },
      {
        id: uuidv4(),
        userId: defaultUserId,
        recipeId: 'recipe-4',
        recipeTitle: 'One-Pan Bell Pepper & Feta Skillet',
        cookedAt: addDays(now, -4),
        servingsCooked: 1,
        cookTimeMinutes: 15,
        calories: 340,
        ingredientsRescuedCount: 2,
        estimatedSavingsUsd: 6.0,
        zeroWasteBadge: true,
      },
    ];
    defaultHistory.forEach((h) => this.mealHistory.set(h.id, h));
  }
}

export const store = new MemoryStore();
