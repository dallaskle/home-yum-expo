import { create } from 'zustand';
import { MealRating } from '@/types/database.types';
import { RatingsAPI } from '../api/ratings.api';

interface RatingsState {
  ratings: Record<string, MealRating>;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  rateMeal: (videoId: string, rating: number, mealId?: string, comment?: string) => Promise<void>;
  getRatingForMeal: (videoId: string) => MealRating | null;
}

export const useRatingsStore = create<RatingsState>()((set, get) => ({
  ratings: {},
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const ratings = await RatingsAPI.getUserRatings();
      set({
        ratings: ratings.reduce((acc, rating) => ({
          ...acc,
          [rating.videoId]: rating,
        }), {}),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize ratings',
        isLoading: false,
      });
    }
  },

  rateMeal: async (videoId: string, rating: number, mealId?: string, comment?: string) => {
    set({ isLoading: true, error: null });
    try {
      const mealRating = await RatingsAPI.rateMeal(videoId, rating, mealId, comment);
      set(state => ({
        ratings: {
          ...state.ratings,
          [videoId]: mealRating,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to rate meal',
        isLoading: false,
      });
      throw error;
    }
  },

  getRatingForMeal: (videoId: string) => {
    return get().ratings[videoId] || null;
  },
})); 