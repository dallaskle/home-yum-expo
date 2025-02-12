import { ManualRecipeResponse } from "@/types/database.types";
import { auth } from '@/config/auth';
import { getIdToken } from 'firebase/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.base;

export const manualRecipeApi = {
  generateRecipe: async (prompt: string): Promise<ManualRecipeResponse> => {
    console.log('🔵 Generating manual recipe for prompt:', prompt);
    
    try {
      const token = await getIdToken(auth.currentUser!);
      if (!token) {
        console.error('❌ Authentication error: No ID token available');
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/manual-recipe/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error('❌ Failed to generate recipe:', response.status, response.statusText);
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      console.log('✅ Recipe generated successfully');
      return data;
    } catch (error) {
      console.error('❌ Error generating recipe:', error);
      throw error;
    }
  },

  getRecipeStatus: async (logId: string): Promise<ManualRecipeResponse> => {
    console.log('🔵 Fetching manual recipe status for ID:', logId);
    
    try {
      const token = await getIdToken(auth.currentUser!);
      if (!token) {
        console.error('❌ Authentication error: No ID token available');
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/manual-recipe/${logId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('❌ Failed to get recipe status:', response.status, response.statusText);
        throw new Error('Failed to get recipe status');
      }

      const data = await response.json();
      console.log('✅ Recipe status:', data.status);
      return data;
    } catch (error) {
      console.error('❌ Error getting recipe status:', error);
      throw error;
    }
  },

  updateRecipe: async (logId: string, updates: { recipe_updates?: string; image_updates?: string }): Promise<ManualRecipeResponse> => {
    console.log('🔵 Updating manual recipe:', logId);
    
    try {
      const token = await getIdToken(auth.currentUser!);
      if (!token) {
        console.error('❌ Authentication error: No ID token available');
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/manual-recipe/${logId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.error('❌ Failed to update recipe:', response.status, response.statusText);
        throw new Error('Failed to update recipe');
      }

      const data = await response.json();
      console.log('✅ Recipe updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Error updating recipe:', error);
      throw error;
    }
  },

  confirmRecipe: async (logId: string): Promise<ManualRecipeResponse> => {
    console.log('🔵 Confirming manual recipe:', logId);
    
    try {
      const token = await getIdToken(auth.currentUser!);
      if (!token) {
        console.error('❌ Authentication error: No ID token available');
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/manual-recipe/${logId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('❌ Failed to confirm recipe:', response.status, response.statusText);
        throw new Error('Failed to confirm recipe');
      }

      const data = await response.json();
      console.log('✅ Recipe confirmed successfully');
      return data;
    } catch (error) {
      console.error('❌ Error confirming recipe:', error);
      throw error;
    }
  }
};
