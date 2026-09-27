import { create } from 'zustand';
import apiClient, { setAuthToken } from '../api/client';
import { IUser, IUserPreferences, INotificationSettings } from '../types';

interface AuthState {
  user: IUser;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updatePreferences: (prefs: Partial<IUserPreferences>) => Promise<void>;
  updateNotifications: (notifs: Partial<INotificationSettings>) => Promise<void>;
}

const STORAGE_KEY = 'fridgeai_auth_credentials';

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

// Check local storage for existing session
const loadStoredSession = (): { token: string; user: IUser } | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[AuthStore] Failed to load stored auth:', e);
    }
  }
  return null;
};

const saveSession = (token: string | null, user: IUser | null) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (token && user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[AuthStore] Failed to save session:', e);
    }
  }
};

const initialSession = loadStoredSession();
if (initialSession?.token) {
  setAuthToken(initialSession.token);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession?.user || DEFAULT_USER,
  token: initialSession?.token || null,
  isAuthenticated: !!initialSession?.token,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      if (token) {
        setAuthToken(token);
        const resolvedUser: IUser = user || {
          ...DEFAULT_USER,
          email,
          name: email.split('@')[0],
        };
        saveSession(token, resolvedUser);
        set({
          token,
          user: resolvedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: 'No token received from server' });
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Login failed';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  loginAsDemo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', {
        email: 'alex.morgan@email.com',
        password: 'password123',
      });
      const { token, user } = response.data;
      if (token) {
        setAuthToken(token);
        const resolvedUser: IUser = user || DEFAULT_USER;
        saveSession(token, resolvedUser);
        set({
          token,
          user: resolvedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
    } catch (e) {
      console.warn('[AuthStore] Demo login backend request bypassed, using offline demo session.');
    }

    // Bulletproof fallback: initialize instant demo session
    const fallbackToken = 'demo_token_alex_morgan_authenticated';
    setAuthToken(fallbackToken);
    saveSession(fallbackToken, DEFAULT_USER);
    set({
      token: fallbackToken,
      user: DEFAULT_USER,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    return true;
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      if (token) {
        setAuthToken(token);
        const resolvedUser: IUser = user || {
          ...DEFAULT_USER,
          name,
          email,
        };
        saveSession(token, resolvedUser);
        set({
          token,
          user: resolvedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: 'No token received from server' });
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: () => {
    setAuthToken(null);
    saveSession(null, null);
    set({
      token: null,
      isAuthenticated: false,
      user: DEFAULT_USER,
      error: null,
    });
  },

  fetchProfile: async () => {
    if (!get().token) return;
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/user/profile');
      if (response.data && response.data.data) {
        const updated = response.data.data;
        saveSession(get().token, updated);
        set({ user: updated, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  updatePreferences: async (prefs: Partial<IUserPreferences>) => {
    const updated = {
      ...get().user.preferences,
      ...prefs,
    };
    const newUser = {
      ...get().user,
      preferences: updated,
    };
    saveSession(get().token, newUser);
    set({ user: newUser });

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
    const newUser = {
      ...get().user,
      notifications: updated,
    };
    saveSession(get().token, newUser);
    set({ user: newUser });

    try {
      await apiClient.put('/user/notifications', notifs);
    } catch (err) {
      // Local state already updated
    }
  },
}));
