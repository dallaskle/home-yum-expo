import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, Text } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { YOUTUBE_API_KEY } from '../../../config/youtube.config';

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16; // 16:9 aspect ratio
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

  // If it has the shorts tag or is vertical, it's likely a short
  return hasShortTag || isVertical;
};

export function YouTubeViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoId, setVideoId] = useState('');
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
      <View style={styles.videoContainer}>
        <YoutubeIframe
          height={videoHeight}
          width={width - 40}
          videoId={videoId}
          play={true}
          webViewProps={{
            androidLayerType: 'hardware',
          }}
        />
      </View>
      <TouchableOpacity 
        style={[styles.nextButton, { opacity: videoQueue.length > 0 ? 1 : 0.5 }]} 
        onPress={handleNext}
        disabled={videoQueue.length === 0}
      >
        <Text style={styles.nextButtonText}>Next Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
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
  videoContainer: {
    alignItems: 'center',
    backgroundColor: '#333333',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 