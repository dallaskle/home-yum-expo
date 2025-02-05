import { MealRating } from '@/types/database.types';
import { auth } from '@/config/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.api;

export class RatingsAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  static async rateMeal(videoId: string, rating: number, mealId?: string, comment?: string): Promise<MealRating> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/rate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, rating, mealId, comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to rate meal');
    }

    return response.json();
  }

  static async getUserRatings(): Promise<MealRating[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/ratings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user ratings');
    }

    return response.json();
  }
} 