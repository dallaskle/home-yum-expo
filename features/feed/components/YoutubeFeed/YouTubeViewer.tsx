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

  const renderVideo = useCallback(({ item }: { item: YouTubeVideo }) => {
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
              console.log('Video is ready');
              setPlay(true);
            }}
            webViewProps={{
              androidLayerType: 'hardware',
            }}
            initialPlayerParams={{
              loop: true,
              controls: false,
            }}
          />
        </View>
      </View>
    );
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;
      if (lastVisibleIndex >= videoQueue.length - 3) {
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