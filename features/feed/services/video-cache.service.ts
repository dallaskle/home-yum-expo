import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Video } from '@/types/database.types';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}video-cache/`;
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

class VideoCacheService {
  private static instance: VideoCacheService;
  private cacheMap: Map<string, string> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): VideoCacheService {
    if (!VideoCacheService.instance) {
      VideoCacheService.instance = new VideoCacheService();
    }
    return VideoCacheService.instance;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const folderInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_FOLDER);
      }
      
      await this.cleanOldCache();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize video cache:', error);
    }
  }

  async getCachedVideo(videoUrl: string): Promise<string | null> {
    if (Platform.OS === 'web') return videoUrl;
    
    await this.initialize();
    const cachedPath = this.cacheMap.get(videoUrl);
    
    if (cachedPath) {
      const fileInfo = await FileSystem.getInfoAsync(cachedPath);
      if (fileInfo.exists) {
        return cachedPath;
      }
      this.cacheMap.delete(videoUrl);
    }
    
    return null;
  }

  async cacheVideo(videoUrl: string): Promise<string> {
    if (Platform.OS === 'web') return videoUrl;
    
    await this.initialize();
    const cachedPath = await this.getCachedVideo(videoUrl);
    if (cachedPath) return cachedPath;

    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp4`;
    const filePath = `${CACHE_FOLDER}${fileName}`;

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        filePath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          // You can emit progress updates here if needed
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      this.cacheMap.set(videoUrl, uri);
      return uri;
    } catch (error) {
      console.error('Failed to cache video:', error);
      return videoUrl;
    }
  }

  private async cleanOldCache() {
    try {
      const contents = await FileSystem.readDirectoryAsync(CACHE_FOLDER);
      let totalSize = 0;
      
      // Get file info and sort by date
      const files = await Promise.all(
        contents.map(async (fileName) => {
          const filePath = `${CACHE_FOLDER}${fileName}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          return { path: filePath, ...fileInfo };
        })
      );

      // Sort files by modification time (oldest first)
      files.sort((a, b) => {
        const aTime = a.modificationTime || 0;
        const bTime = b.modificationTime || 0;
        return aTime - bTime;
      });

      // Remove old files and files that exceed cache size
      for (const file of files) {
        const fileAge = Date.now() - (file.modificationTime || 0) * 1000;
        
        if (fileAge > CACHE_EXPIRY || totalSize > MAX_CACHE_SIZE) {
          await FileSystem.deleteAsync(file.path);
        } else {
          totalSize += file.size || 0;
        }
      }
    } catch (error) {
      console.error('Failed to clean cache:', error);
    }
  }
}

export const videoCacheService = VideoCacheService.getInstance(); 