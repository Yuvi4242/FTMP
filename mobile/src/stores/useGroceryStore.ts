import { create } from 'zustand';
import apiClient from '../api/client';
import { IGroceryItem } from '../types';

interface GroceryState {
  items: IGroceryItem[];
  isLoading: boolean;
  error: string | null;

  fetchGroceryList: () => Promise<void>;
  addItem: (name: string, quantity?: string, category?: string, forRecipeTitle?: string) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>;
  transferCheckedToPantry: () => Promise<number>;
  deleteItem: (id: string) => Promise<void>;
  getPendingCount: () => number;
  getPurchasedCount: () => number;
}

const DEFAULT_GROCERY_ITEMS: IGroceryItem[] = [
  {
    id: 'g-1',
    userId: 'user-alex-1',
    name: 'Fresh Basil',
    quantity: '1 bunch',
    category: 'Produce',
    aisle: 'Produce - Herbs',
    isPurchased: false,
    forRecipeTitle: 'One-Pan Bell Pepper & Feta Skillet',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g-2',
    userId: 'user-alex-1',
    name: 'Extra Virgin Olive Oil',
    quantity: '500ml',
    category: 'Pantry',
    aisle: 'Oils & Vinegars',
    isPurchased: false,
    forRecipeTitle: 'Pantry Restock',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g-3',
    userId: 'user-alex-1',
    name: 'Chia Seeds',
    quantity: '250g',
    category: 'Pantry',
    aisle: 'Baking & Health',
    isPurchased: true,
    forRecipeTitle: 'High-Protein Breakfast Boost',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export const useGroceryStore = create<GroceryState>((set, get) => ({
  items: DEFAULT_GROCERY_ITEMS,
  isLoading: false,
  error: null,

  fetchGroceryList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/grocery');
      if (response.data && response.data.pending) {
        set({
          items: [...response.data.pending, ...response.data.purchased],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  addItem: async (name: string, quantity = '1 unit', category = 'Pantry', forRecipeTitle?: string) => {
    try {
      const response = await apiClient.post('/grocery', {
        name,
        quantity,
        category,
        forRecipeTitle,
      });
      if (response.data) {
        set((state) => ({ items: [response.data, ...state.items] }));
        return;
      }
    } catch (err) {
      const newItem: IGroceryItem = {
        id: `g-${Date.now()}`,
        userId: 'user-alex-1',
        name,
        quantity,
        category: (category as any) || 'Pantry',
        isPurchased: false,
        forRecipeTitle,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ items: [newItem, ...state.items] }));
    }
  },

  togglePurchased: async (id: string) => {
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, isPurchased: !i.isPurchased } : i)),
    }));
    try {
      await apiClient.patch(`/grocery/${id}/toggle`);
    } catch (err) {
      // Local state already updated
    }
  },

  transferCheckedToPantry: async (): Promise<number> => {
    const purchased = get().items.filter((i) => i.isPurchased);
    const count = purchased.length;
    if (count === 0) return 0;

    set((state) => ({
      items: state.items.filter((i) => !i.isPurchased),
    }));

    try {
      await apiClient.post('/grocery/transfer-to-pantry');
    } catch (err) {
      // Local state already updated
    }

    return count;
  },

  deleteItem: async (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
    try {
      await apiClient.delete(`/grocery/${id}`);
    } catch (err) {
      // Local state already updated
    }
  },

  getPendingCount: () => {
    return get().items.filter((i) => !i.isPurchased).length;
  },

  getPurchasedCount: () => {
    return get().items.filter((i) => i.isPurchased).length;
  },
}));
