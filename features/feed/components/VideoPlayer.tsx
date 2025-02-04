import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ResizeMode, Video as ExpoVideo, AVPlaybackStatus } from 'expo-av';
import { Video as VideoType } from '@/types/database.types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  onEnd?: () => void;
}

export function VideoPlayer({ video, isActive, onEnd }: VideoPlayerProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    
    if (status.didJustFinish) {
      // Reset video position and replay
      videoRef.current?.setPositionAsync(0);
      videoRef.current?.playAsync();
      onEnd?.();
    }
  };

  return (
    <View style={styles.container}>
      <ExpoVideo
        ref={videoRef}
        source={{ uri: video.videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      
      {/* Video Info Overlay */}
      <View style={styles.overlay}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          {video.videoTitle}
        </Text>
        <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
          {video.mealName}
        </Text>
        <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
          {video.mealDescription}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
  },
}); 