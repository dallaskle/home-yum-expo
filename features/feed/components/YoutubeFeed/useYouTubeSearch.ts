import { useState, useCallback, useEffect } from 'react';
import { YOUTUBE_API_KEY } from '../../../../config/youtube.config';
import { YouTubeVideo, SearchResponse } from './types';
import { isLikelyShort } from './utils';

const DESIRED_QUEUE_SIZE = 10;

export const useYouTubeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoQueue, setVideoQueue] = useState<YouTubeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [currentSearch, setCurrentSearch] = useState('');

  const fetchMoreVideos = useCallback(async (pageToken?: string) => {
    if (!currentSearch || loading) {
      console.log('⛔ Skipping fetch:', { currentSearch, loading });
      return;
    }
    
    console.log('🔍 Fetching videos:', { currentSearch, pageToken });
    setLoading(true);
    try {
      const pageParam = pageToken ? `&pageToken=${pageToken}` : '';
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&videoDuration=short&type=video&q=${encodeURIComponent(
          currentSearch
        )}${pageParam}&key=${YOUTUBE_API_KEY}`
      );
      const data: SearchResponse = await response.json();
      
      if (data.items && data.items.length > 0) {
        console.log('📦 Got YouTube response:', {
          totalItems: data.items.length,
          firstVideoId: data.items[0].id.videoId
        });
        
        const shortsVideos = data.items.filter(isLikelyShort);
        console.log('🎥 Filtered shorts:', {
          shortsCount: shortsVideos.length,
          firstShortId: shortsVideos[0]?.id.videoId
        });
        
        setVideoQueue(prevQueue => {
          const newQueue = [...prevQueue, ...shortsVideos];
          const finalQueue = newQueue.slice(0, DESIRED_QUEUE_SIZE);
          console.log('🎞 Updated queue:', {
            prevSize: prevQueue.length,
            newSize: finalQueue.length
          });
          return finalQueue;
        });

        setNextPageToken(data.nextPageToken);
      } else {
        console.log('⚠️ No items in YouTube response');
      }
    } catch (error) {
      console.error('❌ Error searching YouTube:', error);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, loading]);

  useEffect(() => {
    console.log('🔄 Checking queue size:', {
      currentSize: videoQueue.length,
      desired: DESIRED_QUEUE_SIZE,
      hasNextPage: !!nextPageToken
    });
    if (videoQueue.length < DESIRED_QUEUE_SIZE && nextPageToken) {
      fetchMoreVideos(nextPageToken);
    }
  }, [videoQueue.length, nextPageToken, fetchMoreVideos]);

  const searchYouTube = useCallback(async () => {
    if (!searchQuery.trim()) {
      console.log('⚠️ Empty search query');
      return;
    }
    
    console.log('🔎 Starting new search:', searchQuery);
    setVideoQueue([]);
    setNextPageToken(undefined);
    setCurrentSearch(searchQuery);
    
    await fetchMoreVideos();
  }, [searchQuery, fetchMoreVideos]);

  return {
    searchQuery,
    setSearchQuery,
    loading,
    videoQueue,
    searchYouTube,
    fetchMoreVideos,
    nextPageToken
  };
}; 