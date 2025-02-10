import React from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useCreateRecipeStore } from '../store/create-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function CreateRecipeForm() {
  const colorScheme = useColorScheme();
  const { videoUrl, setVideoUrl, isProcessing, error, status } = useCreateRecipeStore();

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return Colors[colorScheme ?? 'light'].success;
      case 'failed':
        return Colors[colorScheme ?? 'light'].error;
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
            color: Colors[colorScheme ?? 'light'].text
          }
        ]}
        placeholder="Enter TikTok, Instagram, or YouTube URL"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        value={videoUrl}
        onChangeText={setVideoUrl}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isProcessing}
      />

      {isProcessing && (
        <View style={styles.statusContainer}>
          <ActivityIndicator color={Colors[colorScheme ?? 'light'].accent} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            Processing your recipe...
          </Text>
        </View>
      )}

      {status && !isProcessing && (
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          Status: {status}
        </Text>
      )}

      {error && (
        <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
}); 