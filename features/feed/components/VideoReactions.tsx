import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useReactionsStore } from '../store/reactions.store';
import { ReactionType } from '@/types/database.types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface VideoReactionsProps {
  videoId: string;
}

export function VideoReactions({ videoId }: VideoReactionsProps) {
  const colorScheme = useColorScheme();
  const {
    getReactionForVideo,
    isInTryList,
    addReaction,
    removeReaction,
    addToTryList,
    removeFromTryList,
    isLoading,
  } = useReactionsStore();

  const currentReaction = getReactionForVideo(videoId);
  const inTryList = isInTryList(videoId);

  const handleReaction = async (type: ReactionType) => {
    try {
      if (currentReaction?.reactionType === type) {
        await removeReaction(videoId);
      } else {
        await addReaction(videoId, type);
      }
    } catch (error) {
      console.error('Failed to handle reaction:', error);
    }
  };

  const handleTryList = async () => {
    try {
      if (inTryList) {
        await removeFromTryList(videoId);
      } else {
        await addToTryList(videoId);
      }
    } catch (error) {
      console.error('Failed to handle try list:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors[colorScheme ?? 'light'].accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleReaction(ReactionType.LIKE)}
      >
        <FontAwesome
          name="thumbs-up"
          size={24}
          color={currentReaction?.reactionType === ReactionType.LIKE
            ? Colors[colorScheme ?? 'light'].accent
            : Colors[colorScheme ?? 'light'].text}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleReaction(ReactionType.DISLIKE)}
      >
        <FontAwesome
          name="thumbs-down"
          size={24}
          color={currentReaction?.reactionType === ReactionType.DISLIKE
            ? Colors[colorScheme ?? 'light'].accent
            : Colors[colorScheme ?? 'light'].text}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleTryList}
      >
        <FontAwesome
          name="bookmark"
          size={24}
          color={inTryList
            ? Colors[colorScheme ?? 'light'].accent
            : Colors[colorScheme ?? 'light'].text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 