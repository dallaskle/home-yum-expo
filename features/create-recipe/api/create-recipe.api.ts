import { auth } from '@/config/auth';
import { getIdToken } from 'firebase/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.base;

export interface RecipeLogResponse {
  logId: string;
  userId: string;
  videoUrl: string;
  status: string;
  logMessage?: string;
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
    console.log('✅ Recipe log created successfully:', data);
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
/*
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
*/ 