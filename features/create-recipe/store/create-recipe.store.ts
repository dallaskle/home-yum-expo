import { create } from 'zustand';
import { createRecipeLog, getRecipeLog, RecipeLogResponse } from '../api/create-recipe.api';

interface CreateRecipeStore {
  isProcessing: boolean;
  currentLogId: string | null;
  status: string;
  error: string | null;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  startProcessing: () => Promise<void>;
  checkStatus: () => Promise<void>;
  reset: () => void;
}

export const useCreateRecipeStore = create<CreateRecipeStore>((set, get) => ({
  isProcessing: false,
  currentLogId: null,
  status: '',
  error: null,
  videoUrl: '',

  setVideoUrl: (url: string) => set({ videoUrl: url }),

  startProcessing: async () => {
    const { videoUrl } = get();
    if (!videoUrl) {
      set({ error: 'Please enter a video URL' });
      return;
    }

    set({ isProcessing: true, error: null });
    try {
      const response = await createRecipeLog(videoUrl);
      set({ currentLogId: response.logId, status: response.status });

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to start processing' });
    } finally {
      set({ isProcessing: false });
    }
  },

  checkStatus: async () => {
    const { currentLogId } = get();
    if (!currentLogId) return;

    try {
      const response = await getRecipeLog(currentLogId);
      set({ status: response.status });
      
      if (response.status === 'failed') {
        set({ error: response.logMessage || 'Processing failed' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to check status' });
    }
  },

  reset: () => set({
    isProcessing: false,
    currentLogId: null,
    status: '',
    error: null,
    videoUrl: ''
  })
})); 