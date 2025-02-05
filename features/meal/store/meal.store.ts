import { create } from 'zustand';
import { Recipe, RecipeItem, Ingredient, Nutrition } from '@/types/database.types';
import { MealAPI } from '../api/meal.api';

interface MealState {
  recipe: Recipe | null;
  recipeItems: RecipeItem[];
  ingredients: Ingredient[];
  nutrition: Nutrition | null;
  isLoading: boolean;
  error: string | null;
  fetchRecipeData: (videoId: string) => Promise<void>;
}

export const useMealStore = create<MealState>()((set) => ({
  recipe: null,
  recipeItems: [],
  ingredients: [],
  nutrition: null,
  isLoading: false,
  error: null,

  fetchRecipeData: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await MealAPI.getRecipeData(videoId);
      set({
        recipe: data.recipe,
        recipeItems: data.recipeItems,
        ingredients: data.ingredients,
        nutrition: data.nutrition,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recipe data',
        isLoading: false,
      });
      throw error;
    }
  },
})); 