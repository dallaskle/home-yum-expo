import { auth } from '@/config/auth';
import { getIdToken } from 'firebase/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.base;

export interface ProcessingStep {
  status: 'completed' | 'failed' | 'processing';
  step: 'metadata_extraction' | 'transcription' | 'video_analysis' | 'recipe_generation' | 'nutrition_analysis';
  success: boolean;
  timestamp: string;
  error?: string | null;
}

export interface RecipeLogResponse {
  logId: string;
  userId: string;
  videoId: string;
  videoUrl: string;
  status: string;
  processingSteps: ProcessingStep[];
  metadata?: {
    title: string;
    description: string;
    duration: number;
    thumbnail: string;
    platform: string;
  };
  transcription?: {
    text: string;
    success: boolean;
    error?: string;
  };
  analysis?: {
    recipe: string;
    success: boolean;
    error?: string;
  };
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    success: boolean;
    error?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const createRecipeLog = async (videoUrl: string): Promise<RecipeLogResponse> => {
  console.log('🔵 Creating recipe log for video URL:', videoUrl);
  
  try {
    const token = await getIdToken(auth.currentUser!);
    if (!token) {
      console.error('❌ Authentication error: No ID token available');
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/recipe-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    if (!response.ok) {
      console.error('❌ Failed to create recipe log:', response.status, response.statusText);
      throw new Error('Failed to create recipe log');
    }

    const data = await response.json();
    console.log('✅ Recipe log created successfully');
    return data;
  } catch (error) {
    console.error('❌ Error creating recipe log:', error);
    throw error;
  }
};

export const getRecipeLog = async (logId: string): Promise<RecipeLogResponse> => {
  console.log('🔵 Fetching recipe log status for ID:', logId);
  
  try {
    const token = await getIdToken(auth.currentUser!);
    if (!token) {
      console.error('❌ Authentication error: No ID token available');
      throw new Error('Not authenticated');
    }
    console.log('🔵 Fetching recipe log status for ID:', logId);

    const response = await fetch(`${API_URL}/api/recipe-log/${logId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to get recipe log:', response.status, response.statusText);
      throw new Error('Failed to get recipe log');
    }

    const data = await response.json();
    console.log('✅ Recipe log status:', data.status, 'Message:', data.logMessage || 'No message');
    return data;
  } catch (error) {
    console.error('❌ Error getting recipe log:', error);
    throw error;
  }
};

// Polling functionality preserved for future use

export const pollRecipeStatus = async (logId: string): Promise<RecipeLogResponse> => {
  console.log('🔄 Polling recipe status for ID:', logId);
  
  try {
    const token = await getIdToken(auth.currentUser!);
    if (!token) {
      console.error('❌ Authentication error: No ID token available');
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/recipe-log/${logId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to poll recipe status:', response.status, response.statusText);
      throw new Error('Failed to poll recipe status');
    }

    const data = await response.json();
    console.log('🔄 Poll status:', data.status, 'Message:', data.logMessage || 'No message');
    return data;
  } catch (error) {
    console.error('❌ Error polling recipe status:', error);
    throw error;
  }
};

export const getLatestRecipeLog = async (): Promise<RecipeLogResponse> => {
  console.log('🔵 Fetching latest recipe log');
  
  try {
    const token = await getIdToken(auth.currentUser!);
    if (!token) {
      console.error('❌ Authentication error: No ID token available');
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/recipe-log/latest`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to get latest recipe log:', response.status, response.statusText);
      throw new Error('Failed to get latest recipe log');
    }

    const data = await response.json();
    console.log('✅ Latest recipe log status:', data.status);
    return data;
  } catch (error) {
    console.error('❌ Error getting latest recipe log:', error);
    throw error;
  }
};
