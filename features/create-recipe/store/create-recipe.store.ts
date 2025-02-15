import { create } from 'zustand';
import { createRecipeLog, getRecipeLog, ProcessingStep, getLatestRecipeLog } from '../api/create-recipe.api';
import { useFeedStore } from '@/features/feed/store/feed.store';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

interface CreateRecipeStore {
  isProcessing: boolean;
  status: string;
  processingSteps: ProcessingStep[];
  error: string | null;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  startProcessing: (onSuccess?: () => void) => Promise<void>;
  reset: () => void;
  fullReset: () => void;
  getProgress: () => number;
  currentLogId: string | null;
  pollRecipeStatus: () => Promise<void>;
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
  currentLogId: null,

  setVideoUrl: (url: string) => set({ videoUrl: url }),

  startProcessing: (onSuccess?: () => void) => {
    const { videoUrl } = get();
    if (!videoUrl) {
      set({ error: 'Please enter a video URL' });
      return Promise.resolve();
    }

    set({ 
      isProcessing: true, 
      error: null, 
      processingSteps: DEFAULT_STEPS,
      status: 'processing'
    });

    return createRecipeLog(videoUrl)
      .then(response => {
        set({ 
          currentLogId: response.logId,
          isProcessing: true,
          status: response.status,
          processingSteps: response.processingSteps || DEFAULT_STEPS
        });
        
        if (response.videoId) {
          return useFeedStore.getState().addVideoToFeed(response.videoId)
            .then(() => {
              Toast.show({
                type: 'success',
                text1: 'Recipe Added!',
                text2: 'Your recipe has been successfully added to your feed',
                position: 'top',
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 50,
                onPress: () => {
                  router.push('/');
                }
              });
              onSuccess?.();
            });
        } else {
          console.error('No videoId in response:', response);
          onSuccess?.();
        }
      })
      .catch(error => {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to start processing',
          isProcessing: false,
          status: 'failed'
        });
        
        Toast.show({
          type: 'error',
          text1: 'Failed to Add Recipe',
          text2: error instanceof Error ? error.message : 'Something went wrong',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50
        });
      });
  },

  reset: () => {
    const { isProcessing, status, processingSteps } = get();
    set({
      videoUrl: '',
      error: null,
      isProcessing,
      status,
      processingSteps
    });
  },

  fullReset: () => set({
    isProcessing: false,
    status: '',
    processingSteps: [],
    error: null,
    videoUrl: '',
    currentLogId: null
  }),

  getProgress: () => {
    return 100; // Always return 100 since we're not tracking real progress anymore
  },

  pollRecipeStatus: () => {
    const { isProcessing } = get();
    
    if (!isProcessing) {
      return Promise.resolve();
    }

    return getLatestRecipeLog()
      .then(response => {
        console.log('response', response);
        
        set({ 
          status: response.status,
          processingSteps: response.processingSteps || [],
        });

        if (response.status === 'completed' || response.status === 'failed') {
          set({ 
            isProcessing: false
          });
        }
      })
      .catch(error => {
        console.error('Error polling recipe status:', error);
        // On 404, stop polling since there's no log to check
        if (error.message.includes('404')) {
          set({ isProcessing: false });
        }
      });
  },
})); 