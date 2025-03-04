import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Image as RNImage, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useReactionsStore } from '@/features/feed/store/reactions.store';
import { UserVideoReaction, ReactionType, Video } from '@/types/database.types';

// Extend UserVideoReaction to include the video property that gets added by the API
interface EnrichedUserVideoReaction extends UserVideoReaction {
  video: Video;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = SCREEN_WIDTH / 3 - 2;

export function LikedVideosTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const { reactions, isLoading, initialize } = useReactionsStore();

  useEffect(() => {
    initialize();
  }, []);

  const likedVideos = Object.values(reactions).filter(
    reaction => reaction.reactionType === ReactionType.LIKE
  ) as EnrichedUserVideoReaction[];

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].accent} />
      </View>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="heart" size={48} color={Colors[colorScheme].text} style={styles.emptyIcon} />
        <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
          No liked videos yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      {likedVideos.map((reaction: EnrichedUserVideoReaction) => (
        <Pressable 
          key={reaction.videoId}
          style={styles.thumbnailContainer}
          onPress={() => {
            // Handle video press
          }}
        >
          <View style={styles.thumbnailWrapper}>
            <RNImage
              source={{ 
                uri: reaction.video.thumbnailUrl?.replace(/\?$/, '')
              }}
              style={[styles.thumbnail, { backgroundColor: '#666' }]}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <FontAwesome name="play" size={20} color="white" />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0.5,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    margin: 0.5
  },
  thumbnailWrapper: {
    flex: 1,
    backgroundColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1,
    minHeight: THUMBNAIL_SIZE,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#666',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 