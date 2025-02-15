import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { ProcessingStep } from '@/features/create-recipe/api/create-recipe.api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateRecipeStore } from '@/features/create-recipe/store/create-recipe.store';

const STEP_LABELS = {
  metadata_extraction: 'Pulling Video Data',
  transcription: 'Listening to the video',
  video_analysis: 'Analyzing the video',
  recipe_generation: 'Generating the recipe',
  nutrition_analysis: 'Calculating the nutrition'
} as const;

type StepKey = keyof typeof STEP_LABELS;

interface ProgressTrackerProps {
  steps: ProcessingStep[];
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
  const colorScheme = useColorScheme();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const textAnims = useRef(Object.keys(STEP_LABELS).map(() => new Animated.Value(1))).current;
  const currentStepIndex = useRef(0);
  const pollInterval = useRef<NodeJS.Timeout>();
  const { isProcessing, pollRecipeStatus } = useCreateRecipeStore();

  useEffect(() => {
    console.log('pollRecipeStatus', pollRecipeStatus);
  }, [pollRecipeStatus]);

  useEffect(() => {
    // Spin animation for icons
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spin.start();

    // Set up polling if processing is active
    if (isProcessing) {
      pollInterval.current = setInterval(() => {
        console.log('Polling recipe status');
        pollRecipeStatus();
      }, 5000); // Poll every 5 seconds
    }

    // Text animation sequence
    const animateNextStep = () => {
      const currentAnim = textAnims[currentStepIndex.current];
      const nextIndex = (currentStepIndex.current + 1) % textAnims.length;

      Animated.sequence([
        // Scale up current text
        Animated.timing(currentAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Scale down current text
        Animated.timing(currentAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => {
        currentStepIndex.current = nextIndex;
        animateNextStep();
      });
    };

    animateNextStep();

    return () => {
      spin.stop();
      textAnims.forEach(anim => anim.stopAnimation());
      if (pollInterval.current) {
        console.log('Clearing interval');
        clearInterval(pollInterval.current);
      }
    };
  }, [isProcessing]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
        Processing Your Recipe
      </Text>
      <View style={styles.stepsContainer}>
        {Object.keys(STEP_LABELS).map((step, index) => (
          <View key={step} style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <View style={[
                styles.stepIcon, 
                { backgroundColor: Colors[colorScheme ?? 'light'].accent }
              ]}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <MaterialCommunityIcons name="sync" size={16} color="white" />
                </Animated.View>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Animated.View 
                style={[
                  styles.stepLabelContainer,
                  {
                    transform: [
                      { scale: textAnims[index] },
                      { translateX: textAnims[index].interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [0, 10]
                      })}
                    ]
                  }
                ]}
              >
                <Text 
                  style={[
                    styles.stepLabel, 
                    { color: Colors[colorScheme ?? 'light'].text }
                  ]}
                >
                  {STEP_LABELS[step as StepKey]}
                </Text>
              </Animated.View>
            </View>
          </View>
        ))}
      </View>
      <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        This may take a minute or two... but you're free to go
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    position: 'relative',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 24,
    opacity: 0.7,
  },
  stepsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  stepIconContainer: {
    marginRight: 15,
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
  },
  stepLabelContainer: {
    alignSelf: 'flex-start',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 