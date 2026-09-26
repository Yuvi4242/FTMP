import { create } from 'zustand';
import apiClient from '../api/client';
import { IUser, IUserPreferences, INotificationSettings } from '../types';

interface AuthState {
  user: IUser;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updatePreferences: (prefs: Partial<IUserPreferences>) => Promise<void>;
  updateNotifications: (notifs: Partial<INotificationSettings>) => Promise<void>;
}

const DEFAULT_USER: IUser = {
  id: 'user-alex-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@email.com',
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
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEFAULT_USER,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/user/profile');
      if (response.data && response.data.data) {
        set({ user: response.data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      // Retain default demo user on network fallback
      set({ isLoading: false, error: err.message });
    }
  },

  updatePreferences: async (prefs: Partial<IUserPreferences>) => {
    const updated = {
      ...get().user.preferences,
      ...prefs,
    };
    set((state) => ({
      user: {
        ...state.user,
        preferences: updated,
      },
    }));

    try {
      await apiClient.put('/user/preferences', prefs);
    } catch (err) {
      // Local state already updated
    }
  },

  updateNotifications: async (notifs: Partial<INotificationSettings>) => {
    const updated = {
      ...get().user.notifications,
      ...notifs,
    };
    set((state) => ({
      user: {
        ...state.user,
        notifications: updated,
      },
    }));

    try {
      await apiClient.put('/user/notifications', notifs);
    } catch (err) {
      // Local state already updated
    }
  },
}));
