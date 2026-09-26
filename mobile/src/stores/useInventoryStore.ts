import { create } from 'zustand';
import apiClient from '../api/client';
import { IInventoryItem, ExpiryStatus } from '../types';

interface InventoryState {
  items: IInventoryItem[];
  selectedLocation: string; // 'All' | 'Fridge' | 'Freezer' | 'Pantry'
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  fetchInventory: () => Promise<void>;
  setSelectedLocation: (location: string) => void;
  setSearchQuery: (query: string) => void;
  addItem: (item: Partial<IInventoryItem>) => Promise<void>;
  updateItem: (id: string, updates: Partial<IInventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getCriticalCount: () => number;
  getSoonCount: () => number;
  getFreshCount: () => number;
}

const DEFAULT_PANTRY_ITEMS: IInventoryItem[] = [
  {
    id: 'pantry-1',
    userId: 'user-alex-1',
    name: 'Chicken Breast',
    quantity: 500,
    unit: 'g',
    category: 'Meat & Poultry',
    storageLocation: 'Main Shelf',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    expiryStatus: 'critical',
    daysUntilExpiry: 0,
    addedViaScan: true,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-2',
    userId: 'user-alex-1',
    name: 'Baby Spinach',
    quantity: 1,
    unit: 'bag',
    category: 'Produce',
    storageLocation: 'Crisper Drawer',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'soon',
    daysUntilExpiry: 2,
    addedViaScan: true,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-3',
    userId: 'user-alex-1',
    name: 'Greek Yogurt',
    quantity: 450,
    unit: 'g',
    category: 'Dairy & Eggs',
    storageLocation: 'Main Shelf',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'soon',
    daysUntilExpiry: 3,
    addedViaScan: true,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-4',
    userId: 'user-alex-1',
    name: 'Eggs (Large)',
    quantity: 6,
    unit: 'pcs',
    category: 'Dairy & Eggs',
    storageLocation: 'Fridge Door',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'fresh',
    daysUntilExpiry: 8,
    addedViaScan: true,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-5',
    userId: 'user-alex-1',
    name: 'Bell Peppers',
    quantity: 2,
    unit: 'pcs',
    category: 'Produce',
    storageLocation: 'Crisper Drawer',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'fresh',
    daysUntilExpiry: 5,
    addedViaScan: false,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-6',
    userId: 'user-alex-1',
    name: 'Feta Cheese Block',
    quantity: 200,
    unit: 'g',
    category: 'Dairy & Eggs',
    storageLocation: 'Main Shelf',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'fresh',
    daysUntilExpiry: 12,
    addedViaScan: false,
    imageUrl: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-7',
    userId: 'user-alex-1',
    name: 'Rolled Oats',
    quantity: 1,
    unit: 'kg',
    category: 'Pantry Staples',
    storageLocation: 'Pantry',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'fresh',
    daysUntilExpiry: 60,
    addedViaScan: false,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pantry-8',
    userId: 'user-alex-1',
    name: 'Frozen Mixed Berries',
    quantity: 1,
    unit: 'bag',
    category: 'Frozen',
    storageLocation: 'Freezer Door',
    purchaseDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
    expiryStatus: 'fresh',
    daysUntilExpiry: 90,
    addedViaScan: false,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80',
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: DEFAULT_PANTRY_ITEMS,
  selectedLocation: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/inventory');
      if (response.data && response.data.items) {
        set({ items: response.data.items, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  setSelectedLocation: (location: string) => {
    set({ selectedLocation: location });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  addItem: async (itemData: Partial<IInventoryItem>) => {
    try {
      const response = await apiClient.post('/inventory', itemData);
      if (response.data) {
        set((state) => ({ items: [response.data, ...state.items] }));
        return;
      }
    } catch (err) {
      // Fallback local add
      const newItem: IInventoryItem = {
        id: `pantry-${Date.now()}`,
        userId: 'user-alex-1',
        name: itemData.name || 'New Item',
        quantity: itemData.quantity || 1,
        unit: itemData.unit || 'pcs',
        category: itemData.category || 'Produce',
        storageLocation: itemData.storageLocation || 'Main Shelf',
        purchaseDate: new Date().toISOString(),
        expiryDate: itemData.expiryDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        expiryStatus: (itemData.expiryStatus as ExpiryStatus) || 'fresh',
        daysUntilExpiry: itemData.daysUntilExpiry ?? 7,
        addedViaScan: false,
      };
      set((state) => ({ items: [newItem, ...state.items] }));
    }
  },

  updateItem: async (id: string, updates: Partial<IInventoryItem>) => {
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
    try {
      await apiClient.put(`/inventory/${id}`, updates);
    } catch (err) {
      // Local state already updated
    }
  },

  deleteItem: async (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
    try {
      await apiClient.delete(`/inventory/${id}`);
    } catch (err) {
      // Local state already updated
    }
  },

  getCriticalCount: () => {
    return get().items.filter((i) => i.expiryStatus === 'critical').length;
  },

  getSoonCount: () => {
    return get().items.filter((i) => i.expiryStatus === 'soon').length;
  },

  getFreshCount: () => {
    return get().items.filter((i) => i.expiryStatus === 'fresh').length;
  },
}));
