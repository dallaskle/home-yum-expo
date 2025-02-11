import { create } from 'zustand';
import { createRecipeLog, getRecipeLog, RecipeLogResponse, ProcessingStep } from '../api/create-recipe.api';

interface CreateRecipeStore {
  isProcessing: boolean;
  currentLogId: string | null;
  status: string;
  processingSteps: ProcessingStep[];
  error: string | null;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  startProcessing: () => Promise<void>;
  checkStatus: () => Promise<void>;
  reset: () => void;
  // Helper methods for UI
  getCurrentStep: () => ProcessingStep | undefined;
  getProgress: () => number;
  getCompletedSteps: () => ProcessingStep[];
  getFailedStep: () => ProcessingStep | undefined;
}

const POLLING_INTERVAL = 2000; // 2 seconds

export const useCreateRecipeStore = create<CreateRecipeStore>((set, get) => ({
  isProcessing: false,
  currentLogId: null,
  status: '',
  processingSteps: [],
  error: null,
  videoUrl: '',

  setVideoUrl: (url: string) => set({ videoUrl: url }),

  startProcessing: async () => {
    const { videoUrl } = get();
    if (!videoUrl) {
      set({ error: 'Please enter a video URL' });
      return;
    }

    set({ isProcessing: true, error: null, processingSteps: [] });
    try {
      const response = await createRecipeLog(videoUrl);
      set({ 
        currentLogId: response.logId, 
        status: response.status,
        processingSteps: response.processingSteps
      });

      // Start polling if processing is not complete
      if (response.status !== 'completed' && response.status !== 'failed') {
        const pollInterval = setInterval(async () => {
          const { currentLogId, status } = get();
          if (!currentLogId || status === 'completed' || status === 'failed') {
            clearInterval(pollInterval);
            return;
          }
          await get().checkStatus();
        }, POLLING_INTERVAL);
      }

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to start processing' });
    } finally {
      if (get().status === 'completed' || get().status === 'failed') {
        set({ isProcessing: false });
      }
    }
  },

  checkStatus: async () => {
    const { currentLogId } = get();
    if (!currentLogId) return;

    try {
      const response = await getRecipeLog(currentLogId);
      console.log('response', response);
      set({ 
        status: response.status,
        processingSteps: response.processingSteps
      });
      
      if (response.status === 'failed') {
        const failedStep = get().getFailedStep();
        set({ 
          error: failedStep?.error || 'Processing failed',
          isProcessing: false 
        });
      } else if (response.status === 'completed') {
        set({ isProcessing: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to check status' });
    }
  },

  reset: () => set({
    isProcessing: false,
    currentLogId: null,
    status: '',
    processingSteps: [],
    error: null,
    videoUrl: ''
  }),

  // Helper methods for UI
  getCurrentStep: () => {
    const { processingSteps } = get();
    return processingSteps.find(step => step.status === 'processing') || 
           processingSteps[processingSteps.length - 1];
  },

  getProgress: () => {
    const { processingSteps } = get();
    if (!processingSteps.length) return 0;

    const weights = {
      metadata_extraction: 0.1,
      transcription: 0.2,
      video_analysis: 0.3,
      recipe_generation: 0.2,
      nutrition_analysis: 0.2
    };

    let progress = 0;
    processingSteps.forEach(step => {
      if (step.status === 'completed') {
        progress += weights[step.step] * 100;
      } else if (step.status === 'processing') {
        progress += (weights[step.step] * 100) / 2;
      }
    });

    return Math.min(Math.round(progress), 100);
  },

  getCompletedSteps: () => {
    const { processingSteps } = get();
    return processingSteps.filter(step => step.status === 'completed');
  },

  getFailedStep: () => {
    const { processingSteps } = get();
    return processingSteps.find(step => step.status === 'failed');
  }
})); 