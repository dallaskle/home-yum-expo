import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, Text, FlatList } from 'react-native';
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
  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

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

  // Update video URL when videoId changes
  useEffect(() => {
    if (videoId) {
      getVideoUrl(videoId).then(url => {
        if (url) setVideoUrl(url);
      });
    }
  }, [videoId]);

  const renderVideo = useCallback(({ item, index }: { item: YouTubeVideo; index: number }) => {
    const dimensions = calculateDimensions(item);
    return (
      <View style={[styles.videoItem, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 120 }]}>
        <View style={styles.videoWrapper}>
          <YoutubeIframe
            height={SCREEN_HEIGHT - 120}
            width={dimensions.width * 3}
            videoId={item.id.videoId}
            play={true}
            webViewProps={{
              androidLayerType: 'hardware',
            }}
          />
        </View>
      </View>
    );
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }: any) => {
    if (viewableItems.length > 0) {
      // Check if we need to fetch more videos
      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;
      if (lastVisibleIndex >= videoQueue.length - 3) {
        fetchMoreVideos(nextPageToken);
      }
    }
  }, [fetchMoreVideos, nextPageToken, videoQueue.length]);

  const handleNext = useCallback(() => {
    if (flatListRef.current && videoQueue.length > 0) {
      flatListRef.current.scrollToIndex({
        index: 1,
        animated: true
      });
    }
  }, [videoQueue.length]);

  console.log('videoQueue', videoQueue.length);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} pointerEvents="box-none">
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
      </View>
      <FlatList
        ref={flatListRef}
        data={videoQueue}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id.videoId}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    marginTop: 60, // Add space for the search container
  },
  videoItem: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoWrapper: {
    position: 'absolute',
    left: -SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
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
}); 