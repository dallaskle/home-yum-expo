import { Video } from '@/types/database.types';
import { auth } from '@/config/auth';
import { getIdToken } from 'firebase/auth';
import { API_URLS } from '@/config/urls';

const API_URL = API_URLS.base;

interface VideoUpload {
  videoTitle: string;
  videoDescription: string;
  mealName: string;
  mealDescription: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export class FeedAPI {
  static async getFeed(pageSize: number = 10, lastVideoId?: string, isInitialLoad: boolean = false): Promise<Video[]> {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const queryParams = new URLSearchParams({
        page_size: isInitialLoad ? '3' : pageSize.toString(),
        ...(lastVideoId && { last_video_id: lastVideoId }),
      });

      const response = await fetch(`${API_URL}/api/videos/feed?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video feed');
      }

      const videos = await response.json();
      return videos.map((video: any) => ({
        ...video,
        uploadedAt: new Date(video.uploadedAt),
        userReaction: video.userReaction ? {
          ...video.userReaction,
          reactionDate: new Date(video.userReaction.reactionDate)
        } : null,
        tryListItem: video.tryListItem ? {
          ...video.tryListItem,
          addedDate: new Date(video.tryListItem.addedDate)
        } : null
      }));
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }

  static async getVideo(videoId: string): Promise<Video> {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  }

  static async uploadVideo(data: {
    videoUrl: string;
    thumbnailUrl: string;
    videoTitle: string;
    videoDescription: string;
    mealName: string;
    mealDescription: string;
    duration: number;
  }) {
    try {
      const token = await getIdToken(auth.currentUser!);

      // Send data to backend which will handle storage uploads
      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
} 