import { create } from 'zustand';
import { User } from '@/types/database.types';
import { UserAPI } from '../api/user.api';
import { router } from 'expo-router';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await UserAPI.getUser();
      console.log('auth.store: user', user);
      set({ user, isInitialized: true, error: null });
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    } catch (error) {
      set({ user: null, error: null });
      router.replace('/login');
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await UserAPI.login(email, password);
      set({ user, error: null });
      router.replace('/(tabs)');
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to login' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await UserAPI.signup(email, password);
      set({ user, error: null });
      router.replace('/(tabs)');
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to signup' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await UserAPI.logout();
      set({ user: null, error: null });
      router.replace('/login');
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to logout' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await UserAPI.updateUser(userData);
      set({ user: updatedUser, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
