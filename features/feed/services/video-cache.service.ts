import { Platform } from 'react-native';
import { Video } from '@/types/database.types';

class VideoCacheService {
  private static instance: VideoCacheService;

  private constructor() {}

  static getInstance(): VideoCacheService {
    if (!VideoCacheService.instance) {
      VideoCacheService.instance = new VideoCacheService();
    }
    return VideoCacheService.instance;
  }

  async getCachedVideo(videoUrl: string): Promise<string> {
    return videoUrl;
  }

  async cacheVideo(videoUrl: string): Promise<string> {
    return videoUrl;
  }
}

export const videoCacheService = VideoCacheService.getInstance(); 