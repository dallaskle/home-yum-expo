import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { ProcessingStep } from '@/features/create-recipe/api/create-recipe.api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STEP_LABELS = {
  metadata_extraction: 'Pulling Video Data',
  transcription: 'Listening to the video',
  video_analysis: 'Analyzing the video',
  recipe_generation: 'Generating the recipe',
  nutrition_analysis: 'Calculating the nutrition'
};

interface ProgressTrackerProps {
  steps: ProcessingStep[];
  progress: number;
}

export function ProgressTracker({ steps, progress }: ProgressTrackerProps) {
  const colorScheme = useColorScheme();

  const getStepIcon = (step: ProcessingStep) => {
    if (step.status === 'completed') {
      return (
        <View style={[styles.stepIcon, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
          <MaterialCommunityIcons name="check" size={16} color="white" />
        </View>
      );
    }
    if (step.status === 'failed') {
      return (
        <View style={[styles.stepIcon, { backgroundColor: Colors[colorScheme ?? 'light'].error }]}>
          <MaterialCommunityIcons name="close" size={16} color="white" />
        </View>
      );
    }
    if (step.status === 'processing') {
      return (
        <View style={[styles.stepIcon, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}>
          <MaterialCommunityIcons name="sync" size={16} color="white" />
        </View>
      );
    }
    return (
      <View style={[styles.stepIcon, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
        <MaterialCommunityIcons name="circle-outline" size={16} color="white" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { backgroundColor: Colors[colorScheme ?? 'light'].border }
          ]} 
        />
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { 
              backgroundColor: Colors[colorScheme ?? 'light'].accent,
              height: `${progress}%`
            }
          ]} 
        />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.step} style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              {getStepIcon(step)}
            </View>
            <View style={styles.stepContent}>
              <Text 
                style={[
                  styles.stepLabel, 
                  { color: Colors[colorScheme ?? 'light'].text }
                ]}
              >
                {STEP_LABELS[step.step]}
              </Text>
              {step.error && (
                <Text 
                  style={[
                    styles.errorText, 
                    { color: Colors[colorScheme ?? 'light'].error }
                  ]}
                >
                  {step.error}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    position: 'relative',
  },
  progressBarContainer: {
    width: 4,
    marginRight: 20,
    marginLeft: 18,
    height: '100%',
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 2,
  },
  progressBarFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
  stepsContainer: {
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    position: 'absolute',
    left: -38,
    zIndex: 1,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
    paddingRight: 20,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
}); 