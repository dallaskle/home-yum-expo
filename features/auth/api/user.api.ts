import { User } from '@/types/database.types';
import { auth } from '@/config/auth';
import Constants from 'expo-constants';

// In development, use localhost with the correct port
// In production, use your deployed API URL
const API_URL = __DEV__ 
  ? 'http://127.0.0.1:8001/api'
  : 'https://your-production-api.com/api';  // TODO: Update with your production URL when deployed

export class UserAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  static async createUser(): Promise<User> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  static async getUser(): Promise<User> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateUser(userData: Partial<User>): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
  }
} 