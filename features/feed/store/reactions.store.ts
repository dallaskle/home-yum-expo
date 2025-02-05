import { create } from 'zustand';
import { ReactionsAPI } from '../api/reactions.api';
import { ReactionType, UserVideoReaction, UserTryList } from '@/types/database.types';
import { auth } from '@/config/auth';

interface ReactionsState {
  reactions: Record<string, UserVideoReaction>;
  tryList: Record<string, UserTryList>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  addReaction: (videoId: string, reactionType: ReactionType) => Promise<void>;
  removeReaction: (videoId: string) => Promise<void>;
  addToTryList: (videoId: string, notes?: string) => Promise<void>;
  removeFromTryList: (videoId: string) => Promise<void>;
  
  // Getters
  getReactionForVideo: (videoId: string) => UserVideoReaction | null;
  isInTryList: (videoId: string) => boolean;
}

export const useReactionsStore = create<ReactionsState>()((set, get) => ({
  reactions: {},
  tryList: {},
  isLoading: false,
  error: null,

  initialize: async () => {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      set({ error: 'Not authenticated', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const [reactions, tryList] = await Promise.all([
        ReactionsAPI.getUserReactions(),
        ReactionsAPI.getTryList(),
      ]);

      // Only update state if we got valid data
      if (Array.isArray(reactions) && Array.isArray(tryList)) {
        set({
          reactions: reactions.reduce((acc, reaction) => ({
            ...acc,
            [reaction.videoId]: reaction,
          }), {}),
          tryList: tryList.reduce((acc, item) => ({
            ...acc,
            [item.videoId]: item,
          }), {}),
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: 'Invalid data received from server',
        });
      }
    } catch (error) {
      console.error('Failed to initialize reactions:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize reactions',
        isLoading: false,
      });
    }
  },

  addReaction: async (videoId: string, reactionType: ReactionType) => {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      set({ error: 'Not authenticated', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const reaction = await ReactionsAPI.addReaction(videoId, reactionType);
      if (reaction && reaction.videoId) {
        set(state => ({
          reactions: {
            ...state.reactions,
            [videoId]: reaction,
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add reaction',
        isLoading: false,
      });
      throw error;
    }
  },

  removeReaction: async (videoId: string) => {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      set({ error: 'Not authenticated', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await ReactionsAPI.removeReaction(videoId);
      set(state => {
        const { [videoId]: _, ...remainingReactions } = state.reactions;
        return {
          reactions: remainingReactions,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove reaction',
        isLoading: false,
      });
      throw error;
    }
  },

  addToTryList: async (videoId: string, notes?: string) => {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      set({ error: 'Not authenticated', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const tryListItem = await ReactionsAPI.addToTryList(videoId, notes);
      if (tryListItem && tryListItem.videoId) {
        set(state => ({
          tryList: {
            ...state.tryList,
            [videoId]: tryListItem,
          },
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to try list',
        isLoading: false,
      });
      throw error;
    }
  },

  removeFromTryList: async (videoId: string) => {
    // Check if user is authenticated first
    if (!auth.currentUser) {
      set({ error: 'Not authenticated', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await ReactionsAPI.removeFromTryList(videoId);
      set(state => {
        const { [videoId]: _, ...remainingTryList } = state.tryList;
        return {
          tryList: remainingTryList,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from try list',
        isLoading: false,
      });
      throw error;
    }
  },

  getReactionForVideo: (videoId: string) => {
    return get().reactions[videoId] || null;
  },

  isInTryList: (videoId: string) => {
    return !!get().tryList[videoId];
  },
})); 