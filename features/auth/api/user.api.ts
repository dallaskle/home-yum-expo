import { User } from '@/types/database.types';
import { auth } from '@/config/auth';
import Constants from 'expo-constants';
import { API_URLS } from '@/config/urls';

// In development, use local network IP with the correct port
// In production, use your deployed API URL
const API_URL = API_URLS.api;

export class UserAPI {
  private static async getAuthToken(): Promise<string> {
    console.log('Getting auth token...');
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    console.log('Token received:', token.substring(0, 10) + '...');
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