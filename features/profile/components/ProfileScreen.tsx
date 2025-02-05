import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator, Image as RNImage } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useProfileStore } from '../store/profile.store';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@rneui/themed';
import { Video } from '@/types/database.types';
import { UserVideosTab } from './UserVideosTab';
import { LikedVideosTab } from './LikedVideosTab';
import { DislikedVideosTab } from './DislikedVideosTab';
import { RatedVideosTab } from './RatedVideosTab';

const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = SCREEN_WIDTH / 3 - 2; // Account for minimal gap

type TabType = 'ratings' | 'videos' | 'likes' | 'dislikes';

export function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { user } = useAuthStore();
  const { userPosts, isLoading, fetchUserPosts } = useProfileStore();
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  useEffect(() => {
    if (user) {
      fetchUserPosts(user.userId);
    }
  }, [user]);

  useEffect(() => {
    if (userPosts.length > 0) {
      // Logs removed
    }
  }, [userPosts]);

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ratings':
        return <RatedVideosTab />;
      case 'videos':
        return <UserVideosTab videos={userPosts} isLoading={isLoading} />;
      case 'likes':
        return <LikedVideosTab />;
      case 'dislikes':
        return <DislikedVideosTab />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          source={user.profilePic ? { uri: user.profilePic } : undefined}
          title={user.username.charAt(0).toUpperCase()}
          containerStyle={styles.profilePic}
          overlayContainerStyle={{
            backgroundColor: Colors[colorScheme].accent,
          }}
        />
        <Text style={[styles.username, { color: Colors[colorScheme].text }]}>
          {user.username}
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: Colors[colorScheme].accent }]}
            onPress={() => {/* TODO: Implement edit profile */}}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: Colors[colorScheme].accent }]}
            onPress={() => {/* TODO: Implement share profile */}}
          >
            <FontAwesome name="share" size={16} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'ratings' && styles.activeTab,
            activeTab === 'ratings' && { borderBottomColor: Colors[colorScheme].accent }
          ]}
          onPress={() => setActiveTab('ratings')}
        >
          <FontAwesome
            name="star"
            size={20}
            color={activeTab === 'ratings' ? Colors[colorScheme].accent : Colors[colorScheme].text}
          />
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'videos' && styles.activeTab,
            activeTab === 'videos' && { borderBottomColor: Colors[colorScheme].accent }
          ]}
          onPress={() => setActiveTab('videos')}
        >
          <FontAwesome
            name="video-camera"
            size={20}
            color={activeTab === 'videos' ? Colors[colorScheme].accent : Colors[colorScheme].text}
          />
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'likes' && styles.activeTab,
            activeTab === 'likes' && { borderBottomColor: Colors[colorScheme].accent }
          ]}
          onPress={() => setActiveTab('likes')}
        >
          <FontAwesome
            name="heart"
            size={20}
            color={activeTab === 'likes' ? Colors[colorScheme].accent : Colors[colorScheme].text}
          />
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'dislikes' && styles.activeTab,
            activeTab === 'dislikes' && { borderBottomColor: Colors[colorScheme].accent }
          ]}
          onPress={() => setActiveTab('dislikes')}
        >
          <FontAwesome
            name="thumbs-down"
            size={20}
            color={activeTab === 'dislikes' ? Colors[colorScheme].accent : Colors[colorScheme].text}
          />
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={{ paddingBottom: 72 }}>
        {renderTabContent()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 102, 0, 0.5)',
  },
  profilePic: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 102, 0, 0.2)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
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