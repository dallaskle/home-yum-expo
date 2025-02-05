import { create } from 'zustand';
import { MealRating } from '@/types/database.types';
import { RatingsAPI } from '../api/ratings.api';
import { API_URLS } from '@/config/urls';
import { auth } from '@/config/auth';
import { useScheduleStore } from '@/features/schedule/store/schedule.store';

interface AggregatedRating {
  videoId: string;
  averageRating: number;
  numberOfRatings: number;
  lastRated: string;
  comments: string[];
  video: {
    mealName: string;
    mealDescription: string;
    thumbnailUrl: string;
  };
}

interface RatingsState {
  ratings: Record<string, MealRating>;
  aggregatedRatings: AggregatedRating[];
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  rateMeal: (videoId: string, rating: number, mealId?: string, comment?: string) => Promise<void>;
  getRatingForMeal: (videoId: string) => MealRating | null;
  getAggregatedRatings: () => Promise<void>;
}

export const useRatingsStore = create<RatingsState>()((set, get) => ({
  ratings: {},
  aggregatedRatings: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    // Only set loading if we don't have any data
    const state = get();
    const hasNoData = state.aggregatedRatings.length === 0;
    if (hasNoData) {
      set({ isLoading: true, error: null });
    }

    try {
      await get().getAggregatedRatings();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize ratings',
        isLoading: false,
      });
    }
  },

  getAggregatedRatings: async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${API_URLS.api}/meals/ratings/aggregated`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get aggregated ratings');
      }

      const data = await response.json();
      set({ aggregatedRatings: data });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get aggregated ratings',
      });
      throw error;
    }
  },

  rateMeal: async (videoId: string, rating: number, mealId?: string, comment?: string) => {
    set({ isLoading: true, error: null });
    try {
      const mealRating = await RatingsAPI.rateMeal(videoId, rating, mealId, comment);
      
      // Update ratings store
      set(state => ({
        ratings: {
          ...state.ratings,
          [videoId]: mealRating,
        },
        isLoading: false,
      }));

      // Optimistically update schedule store if mealId is provided
      if (mealId) {
        const scheduleStore = useScheduleStore.getState();
        const scheduledMeal = scheduleStore.getMealById(mealId);
        if (scheduledMeal) {
          useScheduleStore.setState({
            scheduledMeals: {
              ...scheduleStore.scheduledMeals,
              [mealId]: {
                ...scheduledMeal,
                rating: mealRating,
              },
            },
          });
        }
      }

      // Refresh aggregated ratings after rating a meal
      await get().getAggregatedRatings();
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