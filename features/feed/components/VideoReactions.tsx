import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useReactionsStore } from '../store/reactions.store';
import { ReactionType, UserVideoReaction, UserTryList } from '@/types/database.types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface VideoReactionsProps {
  videoId: string;
  initialReaction?: UserVideoReaction | null;
  initialTryListItem?: UserTryList | null;
}

export function VideoReactions({ videoId, initialReaction, initialTryListItem }: VideoReactionsProps) {
  const colorScheme = useColorScheme();
  const {
    getReactionForVideo,
    isInTryList,
    addReaction,
    removeReaction,
    addToTryList,
    removeFromTryList,
  } = useReactionsStore();

  const [optimisticReaction, setOptimisticReaction] = useState<ReactionType | null>(
    initialReaction?.reactionType ?? getReactionForVideo(videoId)?.reactionType ?? null
  );
  const [optimisticTryList, setOptimisticTryList] = useState<boolean>(
    initialTryListItem !== null || isInTryList(videoId)
  );

  const handleReaction = async (type: ReactionType) => {
    const previousReaction = optimisticReaction;
    try {
      if (optimisticReaction === type) {
        setOptimisticReaction(null);
        await removeReaction(videoId);
      } else {
        setOptimisticReaction(type);
        await addReaction(videoId, type);
      }
    } catch (error) {
      setOptimisticReaction(previousReaction);
      console.error('Failed to handle reaction:', error);
    }
  };

  const handleTryList = async () => {
    const wasInTryList = optimisticTryList;
    try {
      setOptimisticTryList(!wasInTryList);
      
      if (wasInTryList) {
        await removeFromTryList(videoId);
      } else {
        await addToTryList(videoId);
      }
    } catch (error) {
      setOptimisticTryList(wasInTryList);
      console.error('Failed to handle try list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, optimisticReaction === ReactionType.LIKE && { backgroundColor: Colors.light.accent }]}
        onPress={() => handleReaction(ReactionType.LIKE)}
      >
        <FontAwesome
          name="thumbs-up"
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, optimisticReaction === ReactionType.DISLIKE && { backgroundColor: Colors.light.accent }]}
        onPress={() => handleReaction(ReactionType.DISLIKE)}
      >
        <FontAwesome
          name="thumbs-down"
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, optimisticTryList && { backgroundColor: Colors.light.accent }]}
        onPress={handleTryList}
      >
        <FontAwesome
          name={optimisticTryList ? "check" : "plus"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 144,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    opacity: 0.8,
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