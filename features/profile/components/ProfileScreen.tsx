import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator, Image as RNImage } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useProfileStore } from '../store/profile.store';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@rneui/themed';
import { Video } from '@/types/database.types';


const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = SCREEN_WIDTH / 3 - 2; // Account for minimal gap

export function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { user } = useAuthStore();
  const { userPosts, isLoading, fetchUserPosts } = useProfileStore();

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

      {/* Videos Grid */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].accent} />
        </View>
      ) : userPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="video-camera" size={48} color={Colors[colorScheme].text} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
            No videos uploaded yet
          </Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {userPosts.map((video: Video) => (
            <Pressable 
              key={video.videoId}
              style={styles.thumbnailContainer}
              onPress={() => {
                // Logs removed
              }}
            >
              <View style={styles.thumbnailWrapper}>
                <RNImage
                  source={{ 
                    uri: video.thumbnailUrl?.replace(/\?$/, '')
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
      )}
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