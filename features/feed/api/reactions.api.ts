import { ReactionType, UserVideoReaction, UserTryList } from '@/types/database.types';
import { auth } from '@/config/auth';

const API_URL = 'https://d74b-24-153-157-38.ngrok-free.app/api';

export class ReactionsAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  static async addReaction(videoId: string, reactionType: ReactionType): Promise<UserVideoReaction> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/reactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, reactionType }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add reaction: ${response.statusText}`);
    }

    return response.json();
  }

  static async removeReaction(videoId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/reactions/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove reaction: ${response.statusText}`);
    }
  }

  static async getUserReactions(): Promise<UserVideoReaction[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/reactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get reactions: ${response.statusText}`);
    }

    return response.json();
  }

  static async addToTryList(videoId: string, notes?: string): Promise<UserTryList> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/try-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, notes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add to try list: ${response.statusText}`);
    }

    return response.json();
  }

  static async removeFromTryList(videoId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/try-list/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove from try list: ${response.statusText}`);
    }
  }

  static async getTryList(): Promise<UserTryList[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/videos/try-list`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get try list: ${response.statusText}`);
    }

    return response.json();
  }
} 