import { auth } from '@/config/auth';
import { User } from '@/types/database.types';
import { getIdToken } from 'firebase/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001';

export class ProfileAPI {
  static async updateProfile(userData: Partial<User>): Promise<User> {
    const token = await getIdToken(auth.currentUser!);
    
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  static async getUserPosts(userId: string): Promise<any[]> {
    const token = await getIdToken(auth.currentUser!);
    
    const response = await fetch(`${API_URL}/api/videos/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }

    return response.json();
  }
} 