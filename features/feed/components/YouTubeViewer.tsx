import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, Text } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { YOUTUBE_API_KEY } from '../../../config/youtube.config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DESIRED_QUEUE_SIZE = 10;

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: { width: number; height: number };
      default: { width: number; height: number };
    };
  };
  contentDetails?: {
    duration: string;
  };
}

interface SearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
}

const isLikelyShort = (video: YouTubeVideo): boolean => {
  // Check for #Shorts hashtag in title or description
  const hasShortTag = 
    video.snippet.title.toLowerCase().includes('#shorts') ||
    video.snippet.description.toLowerCase().includes('#shorts');

  // Check thumbnail aspect ratio (vertical video check)
  const thumbnail = video.snippet.thumbnails.high || video.snippet.thumbnails.default;
  const isVertical = thumbnail.height > thumbnail.width;

  console.log('isVertical', isVertical);
  console.log('hasShortTag', hasShortTag);

  // If it has the shorts tag or is vertical, it's likely a short
  return hasShortTag || isVertical;
};

const calculateDimensions = (video: YouTubeVideo) => {
  const thumbnail = video.snippet.thumbnails.high || video.snippet.thumbnails.default;
  const aspectRatio = thumbnail.width / thumbnail.height;
  
  // Always use full width and calculate height based on aspect ratio
  const width = SCREEN_WIDTH;
  const height = width / aspectRatio;
  
  return {
    width,
    height
  };
};

const getVideoUrl = async (videoId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=player&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    if (data.items && data.items[0]) {
      // Extract direct video URL from player data
      // Note: This might need adjustment based on YouTube API response
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting video URL:', error);
    return null;
  }
};

export function YouTubeViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoQueue, setVideoQueue] = useState<YouTubeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentDimensions, setCurrentDimensions] = useState({ 
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  });

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
        // Filter the results using isLikelyShort
        const shortsVideos = data.items.filter(isLikelyShort);
        
        // Add new videos to queue
        setVideoQueue(prevQueue => {
          const newQueue = [...prevQueue, ...shortsVideos];
          return newQueue.slice(0, DESIRED_QUEUE_SIZE);
        });

        // Store next page token if we need more videos
        setNextPageToken(data.nextPageToken);
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, loading]);

  // Check queue size and fetch more if needed
  useEffect(() => {
    if (videoQueue.length < DESIRED_QUEUE_SIZE && nextPageToken) {
      fetchMoreVideos(nextPageToken);
    }
  }, [videoQueue.length, nextPageToken]);

  // Initial search
  const searchYouTube = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    // Reset state for new search
    setVideoQueue([]);
    setNextPageToken(undefined);
    setCurrentSearch(searchQuery);
    
    // Initial fetch
    await fetchMoreVideos();
  }, [searchQuery, fetchMoreVideos]);

  // Set initial video when queue updates from empty
  useEffect(() => {
    if (videoQueue.length > 0 && !videoId) {
      setVideoId(videoQueue[0].id.videoId);
    }
  }, [videoQueue, videoId]);

  // Update dimensions when video changes
  useEffect(() => {
    if (videoQueue.length > 0) {
      const dimensions = calculateDimensions(videoQueue[0]);
      setCurrentDimensions(dimensions);
    }
  }, [videoQueue]);

  // Update video URL when videoId changes
  useEffect(() => {
    if (videoId) {
      getVideoUrl(videoId).then(url => {
        if (url) setVideoUrl(url);
      });
    }
  }, [videoId]);

  const handleNext = useCallback(() => {
    if (videoQueue.length === 0) return;
    
    // Remove current video and set next video
    setVideoQueue(prevQueue => prevQueue.slice(1));
    if (videoQueue.length > 1) {
      setVideoId(videoQueue[1].id.videoId);
    }
  }, [videoQueue]);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={{
          position: 'absolute',
          left: -(SCREEN_WIDTH),
        }}>
          <YoutubeIframe
            height={SCREEN_HEIGHT}
            width={SCREEN_WIDTH * 3}
            videoId={videoId}
            play={true}
            webViewProps={{
              androidLayerType: 'hardware',
            }}
          />
        </View>
      </View>
      <View style={styles.overlay}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search YouTube videos..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchYouTube}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.nextButton, { opacity: videoQueue.length > 0 ? 1 : 0.5 }]} 
          onPress={handleNext}
          disabled={videoQueue.length === 0}
        >
          <Text style={styles.nextButtonText}>Next Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#333333',
    marginTop: 60,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: 'rgba(51, 51, 51, 0.5)',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000000',
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 