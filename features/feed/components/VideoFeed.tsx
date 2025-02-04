import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, FlatList, ViewToken } from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import { useFeedStore } from '../store/feed.store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VideoFeed() {
  const { videos, currentVideoIndex, loadFeed, setCurrentVideoIndex } = useFeedStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadFeed(true);
  }, []);

  const onViewableItemsChanged = React.useCallback(({ changed }: { changed: ViewToken[] }) => {
    const viewableItem = changed.find((item) => item.isViewable);
    if (viewableItem) {
      setCurrentVideoIndex(viewableItem.index ?? 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item: video, index }: { item: any; index: number }) => (
    <View style={styles.videoContainer}>
      <VideoPlayer
        video={video}
        isActive={index === currentVideoIndex}
        onEnd={() => {
          if (index < videos.length - 1) {
            flatListRef.current?.scrollToIndex({
              index: index + 1,
              animated: true,
            });
          }
        }}
      />
    </View>
  );

  if (videos.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.videoId}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={currentVideoIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
  },
}); 