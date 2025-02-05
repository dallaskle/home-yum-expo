import { create } from 'zustand';
import { User } from '@/types/database.types';
import { ProfileAPI } from '../api/profile.api';

interface ProfileState {
  userPosts: any[];
  isLoading: boolean;
  error: string | null;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  userPosts: [],
  isLoading: false,
  error: null,

  updateProfile: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      await ProfileAPI.updateProfile(userData);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchUserPosts: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching posts for user ID:', userId);
      const posts = await ProfileAPI.getUserPosts(userId);
      set({ userPosts: posts, isLoading: false });
    } catch (error) {
      console.error('Error in fetchUserPosts:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user posts',
        isLoading: false,
      });
      throw error;
    }
  },
})); 