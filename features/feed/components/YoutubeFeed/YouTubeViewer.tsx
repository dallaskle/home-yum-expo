import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { styles } from './styles';
import { YouTubeVideo } from './types';
import { calculateDimensions, getVideoUrl } from './utils';
import { useYouTubeSearch } from './useYouTubeSearch';
import { SearchBar } from './SearchBar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function YouTubeViewer() {
  const {
    searchQuery,
    setSearchQuery,
    loading,
    videoQueue,
    searchYouTube,
    fetchMoreVideos,
    nextPageToken
  } = useYouTubeSearch();

  const [videoId, setVideoId] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [play, setPlay] = useState(false);
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  // Auto search on mount
  useEffect(() => {
    console.log('🚀 Component mounted, setting initial search query');
    setSearchQuery('healthy recipe ideas shorts');
    setTimeout(() => {
      console.log('⏰ Timeout finished, triggering search');
      searchYouTube();
    }, 500);
  }, []);

  // Set initial video when queue updates from empty
  useEffect(() => {
    console.log('📼 Video queue updated:', {
      queueLength: videoQueue.length,
      currentVideoId: videoId,
      play
    });
    
    if (videoQueue.length > 0 && !videoId) {
      console.log('🎥 Setting initial video:', videoQueue[0].id.videoId);
      setVideoId(videoQueue[0].id.videoId);
      setPlay(true);
    }
  }, [videoQueue, videoId]);

  // Update video URL when videoId changes
  useEffect(() => {
    if (videoId) {
      console.log('🔗 Fetching URL for video:', videoId);
      getVideoUrl(videoId).then(url => {
        console.log('📍 Got video URL:', url);
        if (url) setVideoUrl(url);
      });
    }
  }, [videoId]);

  const renderVideo = useCallback(({ item }: { item: YouTubeVideo }) => {
    console.log('🎬 Rendering video:', {
      videoId: item.id.videoId,
      play,
      title: item.snippet.title
    });
    
    const dimensions = calculateDimensions(item);
    return (
      <View style={[styles.videoItem, { width: dimensions.width, height: SCREEN_HEIGHT - 120 }]}>
        <View style={styles.videoWrapper}>
          <YoutubeIframe
            height={SCREEN_HEIGHT - 120}
            width={dimensions.width * 3}
            videoId={item.id.videoId}
            play={play}
            onReady={() => {
              console.log('✅ Video ready to play:', {
                videoId: item.id.videoId,
                currentPlay: play
              });
              setPlay(true);
            }}
            onError={(error) => {
              console.log('❌ YouTube player error:', error);
            }}
            webViewProps={{
              androidLayerType: 'hardware',
              onError: (syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error:', nativeEvent);
              },
            }}
            initialPlayerParams={{
              loop: true,
              controls: false,
            }}
          />
        </View>
      </View>
    );
  }, [play]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      console.log('👁 Viewable items changed:', {
        visibleItems: viewableItems.length,
        firstVisibleIndex: viewableItems[0].index,
        queueLength: videoQueue.length
      });
      
      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;
      if (lastVisibleIndex >= videoQueue.length - 3) {
        console.log('🔄 Fetching more videos');
        fetchMoreVideos(nextPageToken);
      }
    }
  }, [fetchMoreVideos, nextPageToken, videoQueue.length]);

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchYouTube}
        loading={loading}
      />
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