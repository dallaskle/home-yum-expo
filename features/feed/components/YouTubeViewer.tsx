import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, TextInput, TouchableOpacity, Text } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { YOUTUBE_API_KEY } from '../../../config/youtube.config';

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16; // 16:9 aspect ratio

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
  const [videoId, setVideoId] = useState('AzfTNCMUfqo');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const searchYouTube = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&videoDuration=short&type=video&q=${encodeURIComponent(
          searchQuery
        )}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      console.log(response);
      console.log(data);
      console.log(data.items[0].id);
      
      if (data.items && data.items.length > 0) {
        // Filter the results using isLikelyShort
        const shortsVideos = data.items.filter(isLikelyShort);
        
        if (shortsVideos.length > 0) {
          setSearchResults(shortsVideos);
          setCurrentIndex(0);
          setVideoId(shortsVideos[0].id.videoId);
        } else {
          // If no shorts found, clear results
          setSearchResults([]);
          console.log('No shorts found in search results');
        }
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleNext = useCallback(() => {
    if (searchResults.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % searchResults.length;
    setCurrentIndex(nextIndex);
    setVideoId(searchResults[nextIndex].id.videoId);
  }, [currentIndex, searchResults]);

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
        style={[styles.nextButton, { opacity: searchResults.length > 0 ? 1 : 0.5 }]} 
        onPress={handleNext}
        disabled={searchResults.length === 0}
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