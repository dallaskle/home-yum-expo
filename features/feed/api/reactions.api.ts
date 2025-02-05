import { ReactionType, UserVideoReaction, UserTryList, Video } from '@/types/database.types';
import { auth } from '@/config/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.base;

export class ReactionsAPI {
  private static async getAuthToken(): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token available');
    return token;
  }

  private static async handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array for 404s when getting lists
        if (response.url.endsWith('/try-list') || response.url.endsWith('/reactions')) {
          return [] as T;
        }
      }
      throw new Error(`${errorMessage}: ${response.statusText}`);
    }
    return response.json();
  }

  private static async getVideoDetails(videoId: string): Promise<Video | null> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to get video: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  static async addReaction(videoId: string, reactionType: ReactionType): Promise<UserVideoReaction> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/api/videos/reactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, reactionType }),
    });

    return this.handleResponse(response, 'Failed to add reaction');
  }

  static async removeReaction(videoId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/api/videos/reactions/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return this.handleResponse(response, 'Failed to remove reaction');
  }

  static async getUserReactions(): Promise<UserVideoReaction[]> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${API_URL}/api/videos/reactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const reactions = await this.handleResponse<UserVideoReaction[]>(response, 'Failed to get reactions');
      
      // Filter out reactions with missing videos and enrich with video data
      const validReactions = [];
      for (const reaction of reactions) {
        const video = await this.getVideoDetails(reaction.videoId);
        if (video) {
          validReactions.push({
            ...reaction,
            video,
          });
        }
      }
      
      return validReactions;
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return [];
    }
  }

  static async addToTryList(videoId: string, notes?: string): Promise<UserTryList> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/api/videos/try-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, notes }),
    });

    return this.handleResponse(response, 'Failed to add to try list');
  }

  static async removeFromTryList(videoId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_URL}/api/videos/try-list/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return this.handleResponse(response, 'Failed to remove from try list');
  }

  static async getTryList(): Promise<UserTryList[]> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${API_URL}/api/videos/try-list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const tryList = await this.handleResponse<UserTryList[]>(response, 'Failed to get try list');
      
      // Filter out try list items with missing videos and enrich with video data
      const validTryListItems = [];
      for (const item of tryList) {
        const video = await this.getVideoDetails(item.videoId);
        if (video) {
          validTryListItems.push({
            ...item,
            video,
          });
        }
      }
      
      return validTryListItems;
    } catch (error) {
      console.error('Error fetching try list:', error);
      return [];
    }
  }
} 