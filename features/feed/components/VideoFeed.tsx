import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureUpdateEvent, GestureStateChangeEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { VideoPlayer } from './VideoPlayer';
import { useFeedStore } from '../store/feed.store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_HEIGHT * 0.2;

export function VideoFeed() {
  const { videos, currentVideoIndex, loadFeed, setCurrentVideoIndex } = useFeedStore();
  const translateY = useSharedValue(0);

  useEffect(() => {
    loadFeed(true);
  }, []);

  const handleSwipe = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < videos.length) {
      setCurrentVideoIndex(nextIndex);
      translateY.value = withSpring(0);
    } else {
      // Bounce back if we're at the end
      translateY.value = withSpring(0);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      translateY.value = event.translationY;
    })
    .onEnd((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (Math.abs(event.velocityY) > 500) {
        // Fast swipe
        if (event.velocityY > 0) {
          runOnJS(handleSwipe)(currentVideoIndex - 1);
        } else {
          runOnJS(handleSwipe)(currentVideoIndex + 1);
        }
      } else if (Math.abs(translateY.value) > SWIPE_THRESHOLD) {
        // Slow swipe past threshold
        if (translateY.value > 0) {
          runOnJS(handleSwipe)(currentVideoIndex - 1);
        } else {
          runOnJS(handleSwipe)(currentVideoIndex + 1);
        }
      } else {
        // Not enough to trigger change
        translateY.value = withSpring(0);
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
          {videos.map((video, index) => (
            <View
              key={video.videoId}
              style={[
                styles.videoContainer,
                {
                  transform: [
                    {
                      translateY: index * SCREEN_HEIGHT,
                    },
                  ],
                },
              ]}
            >
              <VideoPlayer
                video={video}
                isActive={index === currentVideoIndex}
                onEnd={() => handleSwipe(currentVideoIndex + 1)}
              />
            </View>
          ))}
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
  },
}); 