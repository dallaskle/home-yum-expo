import { Meal } from '@/types/database.types';
import { auth } from '@/config/auth';

const API_URL = 'https://d74b-24-153-157-38.ngrok-free.app/api';

export class ScheduleAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  static async scheduleMeal(videoId: string, mealDate: string, mealTime: string): Promise<Meal> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, mealDate, mealTime }),
    });

    if (!response.ok) {
      throw new Error(`Failed to schedule meal: ${response.statusText}`);
    }

    return response.json();
  }

  static async getScheduledMeals(): Promise<Meal[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/schedule`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get scheduled meals: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateMealSchedule(mealId: string, mealDate: string, mealTime: string): Promise<Meal> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/schedule/${mealId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealDate, mealTime }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update meal schedule: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteMealSchedule(mealId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/meals/schedule/${mealId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete meal schedule: ${response.statusText}`);
    }
  }
} 