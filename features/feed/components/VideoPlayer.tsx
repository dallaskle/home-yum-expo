import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ResizeMode, Video as ExpoVideo, AVPlaybackStatus } from 'expo-av';
import { Video as VideoType } from '@/types/database.types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { VideoReactions } from './VideoReactions';
import { RecipeDetailsModal } from '@/features/meal/components/RecipeDetailsModal';
import { FontAwesome } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  onEnd?: () => void;
}

export function VideoPlayer({ video, isActive, onEnd }: VideoPlayerProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const backgroundVideoRef = useRef<ExpoVideo>(null);
  const colorScheme = useColorScheme();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || !backgroundVideoRef.current) return;

    console.log('Video URL:', video.videoUrl);
    
    if (isActive && isPlaying) {
      videoRef.current.playAsync().catch(error => {
        console.error('Error playing video:', error);
        setVideoError(error.message);
      });
      backgroundVideoRef.current.playAsync().catch(console.error);
    } else {
      videoRef.current.pauseAsync().catch(console.error);
      backgroundVideoRef.current.pauseAsync().catch(console.error);
    }
  }, [isActive, isPlaying, video.videoUrl]);

  const handleBackgroundVideoUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    
    if (status.didJustFinish) {
      backgroundVideoRef.current?.setPositionAsync(0);
      backgroundVideoRef.current?.playAsync();
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      console.log('Video not loaded:', status);
      if (status.error) {
        console.error('Video loading error:', status.error);
        setVideoError(status.error);
      }
      return;
    }
    
    if (status.durationMillis) {
      setDuration(status.durationMillis);
    }
    setPosition(status.positionMillis);
    
    if (status.didJustFinish) {
      videoRef.current?.setPositionAsync(0);
      videoRef.current?.playAsync();
      onEnd?.();
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = async (locationX: number) => {
    if (!videoRef.current || !duration) return;
    
    const seekPosition = (locationX / SCREEN_WIDTH) * duration;
    await videoRef.current.setPositionAsync(seekPosition);
  };

  const handleVideoPress = async () => {
    if (!videoRef.current) return;
    
    setIsPlaying(!isPlaying);
    setShowControls(!showControls);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <ExpoVideo
            ref={videoRef}
            source={{ uri: video.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={isActive && isPlaying}
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={(error: Error | string) => {
              console.error('Video error:', error);
              setVideoError(typeof error === 'string' ? error : error.message);
            }}
          />
          {videoError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Error loading video: {videoError}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress, 
                { width: `${(position / duration) * 100}%` }
              ]} 
            />
          </View>
          <TouchableOpacity
            style={styles.progressTouchable}
            onPress={(e) => {
              const { locationX } = e.nativeEvent;
              handleSeek(locationX);
            }}
          >
            <View style={styles.progressOverlay} />
          </TouchableOpacity>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
      
      {/* Video Info Overlay */}
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowRecipeDetails(true)}
            >
              <FontAwesome 
                name="ellipsis-v" 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            <View style={styles.titleContent}>
              <TouchableOpacity 
                onPress={() => setShowRecipeDetails(true)}
                activeOpacity={0.7}
              >
                <View style={styles.titleTextWrapper}>
                  <Text 
                    style={styles.title}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {video.videoTitle}
                  </Text>
                  <Text 
                    style={styles.description}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {video.mealName} | {video.mealDescription}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Video Reactions */}
      {isActive && <VideoReactions 
        videoId={video.videoId} 
        initialReaction={video.userReaction} 
        initialTryListItem={video.tryListItem}
      />}

      {/* Recipe Details Modal */}
      <RecipeDetailsModal
        visible={showRecipeDetails}
        videoId={video.videoId}
        onClose={() => setShowRecipeDetails(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#111111',
  },
  videoContainer: {
    flex: 1,
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    bottom:76,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.light.accent,
  },
  progressTouchable: {
    position: 'absolute',
    top: -10,
    left: 20,
    right: 20,
    height: 44,
  },
  progressOverlay: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 112,
    left: 0,
    right: 0,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    paddingRight: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContent: {
    flex: 1,
    maxWidth: '80%',
  },
  titleTextWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: -4,
    marginHorizontal: -8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textShadowColor: 'rgba(51, 51, 51, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    marginBottom: 0,
    textShadowColor: 'rgba(51, 51, 51, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    color: '#FFFFFF',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
}); 