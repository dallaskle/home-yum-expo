import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useReactionsStore } from '../../store/reactions.store';
import { Video, UserTryList } from '@/types/database.types';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '@/config/auth';
import { ScheduleView } from '@/features/schedule/components/ScheduleView';
import { ScheduleMealModal } from '@/features/schedule/components/ScheduleMealModal';
import { API_URLS } from '@/config/urls';
import { TriedView } from '@/features/schedule/components/TriedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 120;

type ViewMode = 'list' | 'schedule' | 'tried';

interface TryListItemProps {
  videoId: string;
  onRemove: () => void;
}

interface ConfirmModalProps {
  visible: boolean;
  mealName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ visible, mealName, onConfirm, onCancel }: ConfirmModalProps) {
  const colorScheme = useColorScheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Are you sure you want to remove {mealName} from your want to try list?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function TryListItem({ videoId, onRemove }: TryListItemProps) {
  const colorScheme = useColorScheme();
  const [video, setVideo] = useState<Video | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Fetch video details
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${API_URLS.api}/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${await getAuthToken()}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setVideo(data);
        }
      } catch (error) {
        console.error('Failed to fetch video:', error);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleRemovePress = () => {
    if (video) {
      setShowConfirm(true);
    }
  };

  if (!video) {
    return null;
  }

  return (
    <>
      <View style={styles.itemContainer}>
        <Image 
          source={{ uri: video.thumbnailUrl }} 
          style={styles.thumbnail}
        />
        <View style={styles.itemContent}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={2}>
            {video.mealName}
          </Text>
          <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]} numberOfLines={2}>
            {video.mealDescription}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={handleRemovePress}
        >
          <FontAwesome 
            name="times" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].text} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.scheduleButton}
          onPress={() => setShowSchedule(true)}
        >
          <FontAwesome 
            name="calendar" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].text} 
          />
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={showConfirm}
        mealName={video.mealName}
        onConfirm={() => {
          setShowConfirm(false);
          onRemove();
        }}
        onCancel={() => setShowConfirm(false)}
      />
      <ScheduleMealModal
        visible={showSchedule}
        videoId={videoId}
        onClose={() => setShowSchedule(false)}
      />
    </>
  );
}

async function getAuthToken(): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('No auth token available');
  return token;
}

export function TryListScreen() {
  const { tryList, initialize: initializeReactions, removeFromTryList } = useReactionsStore();
  const [removedItems, setRemovedItems] = useState<Record<string, UserTryList>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializeReactions();
  }, []);

  const tryListItems = Object.values(tryList);
  const displayItems = tryListItems.filter(item => !removedItems[item.videoId]);

  const handleRemove = async (videoId: string) => {
    // Store the item before removing it
    const itemToRemove = tryList[videoId];
    
    // Optimistically update UI
    setRemovedItems(prev => ({
      ...prev,
      [videoId]: itemToRemove
    }));

    try {
      await removeFromTryList(videoId);
    } catch (error) {
      // On error, restore the item
      setRemovedItems(prev => {
        const { [videoId]: _, ...rest } = prev;
        return rest;
      });
      console.error('Failed to remove from try list:', error);
    }
  };

  const renderViewToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'list' && styles.toggleButtonActive
        ]}
        onPress={() => setViewMode('list')}
      >
        <Text style={[
          styles.toggleText,
          viewMode === 'list' && styles.toggleTextActive
        ]}>
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'schedule' && styles.toggleButtonActive
        ]}
        onPress={() => setViewMode('schedule')}
      >
        <Text style={[
          styles.toggleText,
          viewMode === 'schedule' && styles.toggleTextActive
        ]}>
          Schedule
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'tried' && styles.toggleButtonActive
        ]}
        onPress={() => setViewMode('tried')}
      >
        <Text style={[
          styles.toggleText,
          viewMode === 'tried' && styles.toggleTextActive
        ]}>
          Tried
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (displayItems.length === 0 && viewMode === 'list') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
          No meals in your try list yet
        </Text>
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => router.push('/')}
        >
          <Text style={[styles.browseText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Browse Recipes
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Want to Try</Text>
      {renderViewToggle()}
      {viewMode === 'list' ? (
        <FlatList
          data={displayItems}
          renderItem={({ item }) => (
            <TryListItem
              videoId={item.videoId}
              onRemove={() => handleRemove(item.videoId)}
            />
          )}
          keyExtractor={(item) => item.tryListId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : viewMode === 'schedule' ? (
        <ScheduleView />
      ) : (
        <TriedView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    paddingTop: 60,
    paddingBottom: 72,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    height: ITEM_HEIGHT,
    position: 'relative',
  },
  thumbnail: {
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
  },
  itemContent: {
    flex: 1,
    padding: 12,
    paddingRight: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    justifyContent: 'center',
    zIndex: 1,
  },
  scheduleButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 8,
    justifyContent: 'center',
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.accent,
    borderRadius: 8,
  },
  browseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    backgroundColor: Colors.light.accent,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.accent,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  toggleTextActive: {
    opacity: 1,
  },
}); 