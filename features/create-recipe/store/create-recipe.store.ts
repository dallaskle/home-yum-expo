import { create } from 'zustand';
import { createRecipeLog, ProcessingStep } from '../api/create-recipe.api';

interface CreateRecipeStore {
  isProcessing: boolean;
  status: string;
  processingSteps: ProcessingStep[];
  error: string | null;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  startProcessing: () => Promise<void>;
  reset: () => void;
  getProgress: () => number;
}

const DEFAULT_STEPS: ProcessingStep[] = [
  { step: 'metadata_extraction', status: 'processing', success: false, timestamp: new Date().toISOString() },
  { step: 'transcription', status: 'processing', success: false, timestamp: new Date().toISOString() },
  { step: 'video_analysis', status: 'processing', success: false, timestamp: new Date().toISOString() },
  { step: 'recipe_generation', status: 'processing', success: false, timestamp: new Date().toISOString() },
  { step: 'nutrition_analysis', status: 'processing', success: false, timestamp: new Date().toISOString() }
];

export const useCreateRecipeStore = create<CreateRecipeStore>((set, get) => ({
  isProcessing: false,
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

    set({ 
      isProcessing: true, 
      error: null, 
      processingSteps: DEFAULT_STEPS,
      status: 'processing'
    });

    try {
      await createRecipeLog(videoUrl);
      // We're not waiting for the response anymore, just showing loading state
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start processing',
        isProcessing: false,
        status: 'failed'
      });
    }
  },

  reset: () => set({
    isProcessing: false,
    status: '',
    processingSteps: [],
    error: null,
    videoUrl: ''
  }),

  getProgress: () => {
    return 100; // Always return 100 since we're not tracking real progress anymore
  },
})); 