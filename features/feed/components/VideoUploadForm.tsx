import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { FeedAPI } from '../api/feed.api';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';

export function VideoUploadForm() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [form, setForm] = useState({
    videoTitle: '',
    videoDescription: '',
    mealName: '',
    mealDescription: '',
  });

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      // Generate thumbnail (in a real app, you'd want to do this server-side)
      setThumbnailUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!videoUri || !thumbnailUri) {
      alert('Please select a video first');
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, you'd upload the video file to a storage service first
      // For now, we'll just use the local URI
      const uploadData = {
        ...form,
        videoUrl: videoUri,
        thumbnailUrl: thumbnailUri,
        duration: 0, // In a real app, you'd calculate this
      };

      await FeedAPI.uploadVideo(uploadData);
      
      // Navigate back to feed
      router.push('/(tabs)');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
        onPress={pickVideo}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {videoUri ? 'Change Video' : 'Select Video'}
        </Text>
      </TouchableOpacity>

      {videoUri && (
        <View style={styles.previewContainer}>
          <Video
            source={{ uri: videoUri }}
            style={styles.preview}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
          />
        </View>
      )}

      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Video Title"
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={form.videoTitle}
        onChangeText={(text) => setForm({ ...form, videoTitle: text })}
      />

      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Video Description"
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={form.videoDescription}
        onChangeText={(text) => setForm({ ...form, videoDescription: text })}
        multiline
      />

      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Meal Name"
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={form.mealName}
        onChangeText={(text) => setForm({ ...form, mealName: text })}
      />

      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Meal Description"
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={form.mealDescription}
        onChangeText={(text) => setForm({ ...form, mealDescription: text })}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: Colors[colorScheme ?? 'light'].accent },
          isLoading && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Video</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#333333',
  },
  uploadButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
}); 