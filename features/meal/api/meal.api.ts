import { Recipe, RecipeItem, Ingredient, Nutrition } from '@/types/database.types';
import { auth } from '@/config/auth';

const API_URL = 'https://d74b-24-153-157-38.ngrok-free.app/api';

interface RecipeData {
  recipe: Recipe | null;
  recipeItems: RecipeItem[];
  ingredients: Ingredient[];
  nutrition: Nutrition | null;
}

export class MealAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  static async getRecipeData(videoId: string): Promise<RecipeData> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/${videoId}/recipe`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe data: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      recipe: data.recipe || null,
      recipeItems: data.recipeItems || [],
      ingredients: data.ingredients || [],
      nutrition: data.nutrition || null,
    };
  }

  static async generateRecipeData(videoId: string): Promise<RecipeData> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/${videoId}/recipe/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate recipe data: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      recipe: data.recipe || null,
      recipeItems: data.recipeItems || [],
      ingredients: data.ingredients || [],
      nutrition: data.nutrition || null,
    };
  }
} 