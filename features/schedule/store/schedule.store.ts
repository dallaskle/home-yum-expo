import { create } from 'zustand';
import { Meal } from '@/types/database.types';
import { ScheduleAPI } from '../api/schedule.api';

interface ScheduleState {
  scheduledMeals: Record<string, Meal>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  scheduleMeal: (videoId: string, mealDate: string, mealTime: string) => Promise<void>;
  updateMealSchedule: (mealId: string, mealDate: string, mealTime: string) => Promise<void>;
  deleteMealSchedule: (mealId: string) => Promise<void>;
  
  // Getters
  getMealsByDate: (date: string) => Meal[];
  getMealById: (mealId: string) => Meal | null;
}

export const useScheduleStore = create<ScheduleState>()((set, get) => ({
  scheduledMeals: {},
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const meals = await ScheduleAPI.getScheduledMeals();
      set({
        scheduledMeals: meals.reduce((acc, meal) => ({
          ...acc,
          [meal.mealId]: meal,
        }), {}),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize schedule',
        isLoading: false,
      });
    }
  },

  scheduleMeal: async (videoId: string, mealDate: string, mealTime: string) => {
    set({ isLoading: true, error: null });
    try {
      const meal = await ScheduleAPI.scheduleMeal(videoId, mealDate, mealTime);
      set(state => ({
        scheduledMeals: {
          ...state.scheduledMeals,
          [meal.mealId]: meal,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to schedule meal',
        isLoading: false,
      });
      throw error;
    }
  },

  updateMealSchedule: async (mealId: string, mealDate: string, mealTime: string) => {
    set({ isLoading: true, error: null });
    try {
      const meal = await ScheduleAPI.updateMealSchedule(mealId, mealDate, mealTime);
      set(state => ({
        scheduledMeals: {
          ...state.scheduledMeals,
          [meal.mealId]: meal,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update meal schedule',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMealSchedule: async (mealId: string) => {
    set({ isLoading: true, error: null });
    try {
      await ScheduleAPI.deleteMealSchedule(mealId);
      set(state => {
        const { [mealId]: _, ...remainingMeals } = state.scheduledMeals;
        return {
          scheduledMeals: remainingMeals,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete meal schedule',
        isLoading: false,
      });
      throw error;
    }
  },

  getMealsByDate: (date: string) => {
    const meals = Object.values(get().scheduledMeals);
    return meals.filter(meal => meal.mealDate === date);
  },

  getMealById: (mealId: string) => {
    return get().scheduledMeals[mealId] || null;
  },
})); 