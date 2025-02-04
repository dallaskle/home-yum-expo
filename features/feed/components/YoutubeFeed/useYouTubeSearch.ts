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
    if (!currentSearch || loading) return;
    
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
        const shortsVideos = data.items.filter(isLikelyShort);
        
        setVideoQueue(prevQueue => {
          const newQueue = [...prevQueue, ...shortsVideos];
          return newQueue.slice(0, DESIRED_QUEUE_SIZE);
        });

        setNextPageToken(data.nextPageToken);
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, loading]);

  useEffect(() => {
    if (videoQueue.length < DESIRED_QUEUE_SIZE && nextPageToken) {
      fetchMoreVideos(nextPageToken);
    }
  }, [videoQueue.length, nextPageToken, fetchMoreVideos]);

  const searchYouTube = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
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