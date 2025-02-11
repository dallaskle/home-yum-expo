import React from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { useCreateRecipeStore } from '../store/create-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ProcessingStep } from '../api/create-recipe.api';

export function CreateRecipeForm() {
  const colorScheme = useColorScheme();
  const { 
    videoUrl, 
    setVideoUrl, 
    isProcessing,
    error,
  } = useCreateRecipeStore();

  const simulateProgress = () => {
    const mockSteps: ProcessingStep[] = [
      { step: 'metadata_extraction', status: 'processing', success: false, timestamp: new Date().toISOString() },
      { step: 'transcription', status: 'processing', success: false, timestamp: new Date().toISOString() },
      { step: 'video_analysis', status: 'processing', success: false, timestamp: new Date().toISOString() },
      { step: 'recipe_generation', status: 'processing', success: false, timestamp: new Date().toISOString() },
      { step: 'nutrition_analysis', status: 'processing', success: false, timestamp: new Date().toISOString() }
    ];

    // First set all steps to not started
    mockSteps.forEach((step, index) => {
      if (index > 0) {
        step.status = 'failed';
        step.success = false;
      }
    });

    useCreateRecipeStore.setState({ 
      isProcessing: true,
      processingSteps: mockSteps,
      status: 'processing'
    });

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= mockSteps.length) {
        clearInterval(interval);
        useCreateRecipeStore.setState({ 
          isProcessing: false,
          status: 'completed'
        });
        return;
      }

      mockSteps[currentStep].status = 'completed';
      mockSteps[currentStep].success = true;
      if (currentStep + 1 < mockSteps.length) {
        mockSteps[currentStep + 1].status = 'processing';
      }

      useCreateRecipeStore.setState({ processingSteps: [...mockSteps] });
      currentStep++;
    }, 2000);
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
  demoButton: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
}); 