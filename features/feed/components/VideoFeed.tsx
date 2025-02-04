import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { VideoPlayer } from './VideoPlayer';
import { useFeedStore } from '../store/feed.store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VideoFeed() {
  const { videos, currentVideoIndex, loadFeed, setCurrentVideoIndex } = useFeedStore();
  const translateY = useSharedValue(0);
  const isGestureActive = useSharedValue(false);

  useEffect(() => {
    loadFeed(true);
  }, []);

  const handleSwipe = (direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? currentVideoIndex + 1 : currentVideoIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < videos.length) {
      setCurrentVideoIndex(nextIndex);
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      // Bounce back if we're at the end
      translateY.value = withTiming(0, { duration: 300 });
    }
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isGestureActive.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isGestureActive.value = false;
      
      // Make it very easy to trigger - just check direction
      if (event.translationY > 0) {
        runOnJS(handleSwipe)('down');
      } else {
        runOnJS(handleSwipe)('up');
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (videos.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.feedContainer, rStyle]}>
          {videos.map((video, index) => {
            // Only render videos that are nearby the current index
            if (Math.abs(index - currentVideoIndex) > 1) return null;
            
            const offset = (index - currentVideoIndex) * SCREEN_HEIGHT;
            
            return (
              <Animated.View
                key={video.videoId}
                style={[
                  styles.videoContainer,
                  {
                    transform: [{ translateY: offset }],
                  },
                ]}
              >
                <VideoPlayer
                  video={video}
                  isActive={index === currentVideoIndex}
                  onEnd={() => handleSwipe('up')}
                />
              </Animated.View>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feedContainer: {
    flex: 1,
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
  },
}); 