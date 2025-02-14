import { create } from 'zustand';
import { Video } from '@/types/database.types';
import { FeedAPI } from '../api/feed.api';
import { auth } from '@/config/auth';

interface FeedState {
  videos: Video[];
  currentVideoIndex: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  isTabFocused: boolean;
  loadFeed: (reset?: boolean) => Promise<void>;
  setCurrentVideoIndex: (index: number) => void;
  addVideoToFeed: (videoId: string) => Promise<void>;
  setTabFocused: (focused: boolean) => void;
}

export const useFeedStore = create<FeedState>()((set, get) => ({
  videos: [],
  currentVideoIndex: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  isTabFocused: true,

  loadFeed: async (reset = false) => {
    try {
      // Check if user is authenticated first
      if (!auth.currentUser) {
        set({ error: 'Not authenticated', isLoading: false });
        return;
      }

      const { videos, isLoading, hasMore } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });

      const lastVideoId = reset ? undefined : videos[videos.length - 1]?.videoId;
      const newVideos = await FeedAPI.getFeed(10, lastVideoId, reset);
      set({
        videos: reset ? newVideos : [...videos, ...newVideos],
        hasMore: newVideos.length === 10,
        isLoading: false,
        error: null,
      });
      if (reset) {
        get().loadFeed();
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load feed',
        isLoading: false,
      });
    }
  },

  setCurrentVideoIndex: (index: number) => {
    const { videos, hasMore, loadFeed } = get();
    set({ currentVideoIndex: index });
    // Preload more videos when we're near the end
    if (index >= videos.length - 3) {
      loadFeed();
    }
  },

  addVideoToFeed: async (videoId: string) => {
    try {
      const { videos, currentVideoIndex } = get();
      console.log('Adding video to feed:', videoId);
      const video = await FeedAPI.getVideo(videoId);
      console.log('Video added to feed:', video);
      
      // Create new array with video inserted at current index
      const newVideos = [
        ...videos.slice(0, currentVideoIndex),
        video,
        ...videos.slice(currentVideoIndex)
      ];
      
      // First update videos array
      set({ videos: newVideos });
      
      // Then trigger a re-render by briefly changing and resetting the currentVideoIndex
      set({ currentVideoIndex: -1 });
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        set({ currentVideoIndex });
      }, 50);
    } catch (error) {
      console.error('Failed to add video to feed:', error);
    }
  },

  setTabFocused: (focused: boolean) => {
    set({ isTabFocused: focused });
  },
})); 