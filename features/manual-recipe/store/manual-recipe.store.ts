import { create } from 'zustand';
import { ManualRecipeResponse } from '@/types/database.types';
import { manualRecipeApi } from '../api/manual-recipe.api';

interface ManualRecipeStore {
  isProcessing: boolean;
  status: 'idle' | 'processing' | 'completed' | 'failed' | 'initial_generated' | 'updated';
  currentStep: number;
  processingSteps: string[];
  recipeData: ManualRecipeResponse | null;
  error: string | null;
  startProcessing: (prompt: string) => Promise<void>;
  confirmRecipe: () => Promise<void>;
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

  confirmRecipe: async () => {
    const { recipeData } = get();
    if (!recipeData?.logId) {
      set({
        error: 'No recipe data available to confirm'
      });
      return;
    }

    set({
      isProcessing: true,
      status: 'processing',
      error: null
    });

    try {
      const response = await manualRecipeApi.confirmRecipe(recipeData.logId);
      set({
        isProcessing: false,
        status: 'completed',
        recipeData: response,
        error: null
      });
    } catch (error) {
      // On error, revert to previous status instead of keeping 'processing'
      const errorMessage = error instanceof Error ? error.message : 'Failed to confirm recipe';
      
      // Check if it's the video creation error
      const isVideoError = errorMessage.includes('video_url') || errorMessage.includes('Could not read image');
      
      set({
        isProcessing: false,
        status: recipeData.status,
        error: isVideoError 
          ? 'Unable to create recipe video at this time. Our team has been notified and is working on a fix.'
          : errorMessage
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
