import React from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { useCreateRecipeStore } from '../store/create-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ProcessingStep } from '../api/create-recipe.api';
import { ProgressTracker } from '@/components/ProgressTracker';

interface CreateRecipeFormProps {
  onSuccess?: () => void;
}

export function CreateRecipeForm({ onSuccess }: CreateRecipeFormProps) {
  const colorScheme = useColorScheme();
  const { 
    videoUrl, 
    setVideoUrl, 
    isProcessing,
    error,
    startProcessing,
    status,
    processingSteps
  } = useCreateRecipeStore();

  const handleSubmit = async () => {
    await startProcessing(() => {
      // Call onSuccess after a short delay to show success state
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    });
  };

  const getButtonText = () => {
    if (isProcessing) {
      return 'Processing...';
    }
    if (status === 'completed') {
      return 'Recipe Added!';
    }
    if (status === 'failed') {
      return 'Try Again';
    }
    return 'Add Recipe';
  };

  const getButtonColor = () => {
    if (status === 'completed') {
      return Colors[colorScheme ?? 'light'].success;
    }
    if (status === 'failed') {
      return Colors[colorScheme ?? 'light'].error;
    }
    return Colors[colorScheme ?? 'light'].accent;
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <ProgressTracker steps={processingSteps} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
        When you add a recipe, HomeYum will:
      </Text>
      
      <View style={styles.bulletPoints}>
        <Text style={[styles.bulletPoint, { color: Colors[colorScheme ?? 'light'].text }]}>
          • Save the video to your recipe book
        </Text>
        <Text style={[styles.bulletPoint, { color: Colors[colorScheme ?? 'light'].text }]}>
          • Extract the ingredients list
        </Text>
        <Text style={[styles.bulletPoint, { color: Colors[colorScheme ?? 'light'].text }]}>
          • Generate step-by-step instructions
        </Text>
        <Text style={[styles.bulletPoint, { color: Colors[colorScheme ?? 'light'].text }]}>
          • Calculate nutrition information
        </Text>
      </View>

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

      {error && (
        <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].error }]}>
          {error}
        </Text>
      )}

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: videoUrl.trim()
              ? getButtonColor()
              : Colors[colorScheme ?? 'light'].border,
            opacity: videoUrl.trim() && !isProcessing ? 1 : 0.5
          }
        ]}
        onPress={handleSubmit}
        disabled={!videoUrl.trim() || isProcessing}
      >
        <Text style={styles.buttonText}>
          {getButtonText()}
        </Text>
      </Pressable>
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
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  bulletPoints: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
}); 