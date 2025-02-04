import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useProfileStore } from '../store/profile.store';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar, Image } from '@rneui/themed';

const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_SIZE = SCREEN_WIDTH / 3;

export function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { user } = useAuthStore();
  const { userPosts, isLoading, fetchUserPosts } = useProfileStore();

  useEffect(() => {
    if (user) {
      console.log('Fetching posts for user:', user.userId);
      fetchUserPosts(user.userId);
    }
  }, [user]);

  useEffect(() => {
    if (userPosts.length > 0) {
      console.log('Posts updated:', userPosts.length);
      console.log('First post thumbnail:', userPosts[0]?.thumbnailUrl);
    }
  }, [userPosts]);

  if (!user) return null;

  const renderPostThumbnail = ({ item }: { item: any }) => {
    // Convert local URI to display URI if needed
    const thumbnailUrl = item.thumbnailUrl?.startsWith('file://')
      ? `data:image/jpeg;base64,${item.thumbnailBase64}`
      : item.thumbnailUrl;

    return (
      <View style={styles.thumbnailContainer}>
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
            onError={(error) => {
              console.error('Image loading error for:', thumbnailUrl);
              console.error('Error details:', error.nativeEvent.error);
            }}
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <FontAwesome name="image" size={24} color="#666" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme].accent} style={styles.loader} />
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPostThumbnail}
          keyExtractor={(item) => item.videoId}
          numColumns={3}
          style={styles.postsGrid}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
                No videos uploaded yet
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    paddingTop: 60,
  },
  header: {
    padding: 20,
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
  postsGrid: {
    flex: 1,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: 1,
  },
  thumbnail: {
    flex: 1,
    borderRadius: 5,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  placeholderThumbnail: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 