import { create } from 'zustand';
import { Video } from '@/types/database.types';
import { FeedAPI } from '../api/feed.api';

interface FeedState {
  videos: Video[];
  currentVideoIndex: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadFeed: (reset?: boolean) => Promise<void>;
  setCurrentVideoIndex: (index: number) => void;
}

export const useFeedStore = create<FeedState>()((set, get) => ({
  videos: [],
  currentVideoIndex: 0,
  isLoading: false,
  error: null,
  hasMore: true,

  loadFeed: async (reset = false) => {
    try {
      const { videos, isLoading, hasMore } = get();
      if (isLoading || (!hasMore && !reset)) return;

      set({ isLoading: true, error: null });

      const lastVideoId = reset ? undefined : videos[videos.length - 1]?.videoId;
      const newVideos = await FeedAPI.getFeed(10, lastVideoId);

      set({
        videos: reset ? newVideos : [...videos, ...newVideos],
        hasMore: newVideos.length === 10,
        isLoading: false,
        error: null,
      });
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
    if (index >= videos.length - 3 && hasMore) {
      loadFeed();
    }
  },
})); 