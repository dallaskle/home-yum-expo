import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useCreateRecipeStore } from '../store/create-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import * as Progress from 'react-native-progress';

const STEP_LABELS = {
  metadata_extraction: 'Extracting Video Information',
  transcription: 'Transcribing Video',
  video_analysis: 'Analyzing Video Content',
  recipe_generation: 'Generating Recipe',
  nutrition_analysis: 'Calculating Nutrition Facts'
};

export function CreateRecipeForm() {
  const colorScheme = useColorScheme();
  const { 
    videoUrl, 
    setVideoUrl, 
    isProcessing, 
    error, 
    status,
    getCurrentStep,
    getProgress,
    getCompletedSteps,
    getFailedStep
  } = useCreateRecipeStore();

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

  const renderProgressBar = () => {
    if (!isProcessing && !status) return null;

    const currentStep = getCurrentStep();
    const progress = getProgress();
    const completedSteps = getCompletedSteps();
    const failedStep = getFailedStep();

    return (
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress / 100}
          width={null}
          height={8}
          color={Colors[colorScheme ?? 'light'].accent}
          unfilledColor={Colors[colorScheme ?? 'light'].border}
          borderWidth={0}
          borderRadius={4}
          style={styles.progressBar}
        />
        
        <Text style={[styles.progressText, { color: Colors[colorScheme ?? 'light'].text }]}>
          {progress}% Complete
        </Text>

        {currentStep && (
          <Text style={[styles.stepText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {STEP_LABELS[currentStep.step]}
          </Text>
        )}

        {completedSteps.length > 0 && (
          <View style={styles.completedStepsContainer}>
            {completedSteps.map((step) => (
              <View key={step.step} style={styles.completedStep}>
                <Text style={[styles.checkmark, { color: Colors[colorScheme ?? 'light'].success }]}>
                  ✓
                </Text>
                <Text style={[styles.completedStepText, { color: Colors[colorScheme ?? 'light'].success }]}>
                  {STEP_LABELS[step.step]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {failedStep && (
          <View style={styles.failedStep}>
            <Text style={[styles.failedStepText, { color: Colors[colorScheme ?? 'light'].error }]}>
              Failed at: {STEP_LABELS[failedStep.step]}
              {failedStep.error && ` - ${failedStep.error}`}
            </Text>
          </View>
        )}
      </View>
    );
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

      {renderProgressBar()}

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
  progressContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 12,
  },
  completedStepsContainer: {
    marginTop: 8,
  },
  completedStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkmark: {
    fontSize: 14,
    marginRight: 6,
  },
  completedStepText: {
    fontSize: 12,
  },
  failedStep: {
    marginTop: 8,
  },
  failedStepText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
}); 