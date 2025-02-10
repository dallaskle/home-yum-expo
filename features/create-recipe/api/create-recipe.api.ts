import { auth } from '@/config/firebase';

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
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error('Not authenticated');

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipe-log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ videoUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to create recipe log');
  }

  return response.json();
};

export const getRecipeLog = async (logId: string): Promise<RecipeLogResponse> => {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error('Not authenticated');

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipe-log/${logId}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get recipe log');
  }

  return response.json();
};

export const pollRecipeStatus = async (logId: string): Promise<RecipeLogResponse> => {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error('Not authenticated');

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipe-log/${logId}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to poll recipe status');
  }

  return response.json();
}; 