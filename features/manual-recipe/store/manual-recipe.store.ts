import { create } from 'zustand';
import { ManualRecipeResponse } from '@/types/database.types';
import { manualRecipeApi } from '../api/manual-recipe.api';

interface ManualRecipeStore {
  isProcessing: boolean;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  currentStep: number;
  processingSteps: string[];
  recipeData: ManualRecipeResponse | null;
  error: string | null;
  startProcessing: (prompt: string) => Promise<void>;
  reset: () => void;
}

export const useManualRecipeStore = create<ManualRecipeStore>((set, get) => ({
  isProcessing: false,
  status: 'idle',
  currentStep: 0,
  processingSteps: [
    'gathering the ingredients',
    'generating the recipe',
    'crafting an image'
  ],
  recipeData: null,
  error: null,

  startProcessing: async (prompt: string) => {
    set({
      isProcessing: true,
      status: 'processing',
      error: null,
      currentStep: 0
    });

    try {
      // Start step rotation
      const rotateSteps = setInterval(() => {
        set(state => ({
          currentStep: (state.currentStep + 1) % state.processingSteps.length
        }));
      }, 3000);

      // Generate recipe
      const response = await manualRecipeApi.generateRecipe(prompt);

      // Clear rotation and update state
      clearInterval(rotateSteps);
      set({
        isProcessing: false,
        status: 'completed',
        recipeData: response
      });

    } catch (error) {
      set({
        isProcessing: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  reset: () => {
    set({
      isProcessing: false,
      status: 'idle',
      currentStep: 0,
      recipeData: null,
      error: null
    });
  }
}));
