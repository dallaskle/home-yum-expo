import React from 'react';
import { View, StyleSheet, Text, TextInput, Image, ScrollView, Pressable } from 'react-native';
import { useManualRecipeStore } from '../store/manual-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ProgressTracker } from '@/components/ProgressTracker';
import { useFeedStore } from '@/features/feed/store/feed.store';
import { router } from 'expo-router';
import { CachedImage } from '@/components/CachedImage';

interface CreateManualRecipeFormProps {
  onSuccess?: () => void;
}

export function CreateManualRecipeForm({ onSuccess }: CreateManualRecipeFormProps) {
  const colorScheme = useColorScheme();
  const [prompt, setPrompt] = React.useState('');
  const { addVideoToFeed } = useFeedStore();
  const { 
    isProcessing,
    status,
    currentStep,
    processingSteps,
    recipeData,
    error,
    startProcessing,
    confirmRecipe
  } = useManualRecipeStore();

  const handleSubmit = async () => {
    if (prompt.trim()) {
      await startProcessing(prompt.trim());
    }
  };

  const handleConfirm = async () => {
    const result = await confirmRecipe();
    if (result?.video) {
      await addVideoToFeed(result.video.videoId);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
      router.replace('/(tabs)/index');
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Text
          key={currentStep}
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}
        >
          {status === 'processing' && recipeData?.status === 'initial_generated' 
            ? 'Confirming recipe and generating assets...'
            : `${processingSteps[currentStep]}...`}
        </Animated.Text>
      </View>
    );
  }

  if (recipeData) {
    return (
      <ScrollView style={styles.previewContainer}>
        <CachedImage 
          source={recipeData.mealImage.url}
          style={styles.previewImage}
        />
        
        <Text style={[styles.title]}>
          {recipeData.recipe.title}
        </Text>
        
        <Text style={[styles.description]}>
          {recipeData.recipe.description}
        </Text>
        
        <View style={styles.timingContainer}>
          <Text style={[styles.timing]}>
            Prep: {recipeData.recipe.prepTime} mins
          </Text>
          <Text style={[styles.timing]}>
            Cook: {recipeData.recipe.cookTime} mins
          </Text>
          <Text style={[styles.timing]}>
            Serves: {recipeData.recipe.servings}
          </Text>
        </View>

        <Text style={[styles.sectionTitle]}>
          Ingredients
        </Text>
        {recipeData.recipe.ingredients.map((ingredient, index) => (
          <Text 
            key={index}
            style={[styles.ingredient]}
          >
            • {ingredient.amount} {ingredient.amountDescription} {ingredient.name}
          </Text>
        ))}

        <Text style={[styles.sectionTitle]}>
          Instructions
        </Text>
        {recipeData.recipe.instructions.map((instruction) => (
          <Text 
            key={instruction.step}
            style={[styles.instruction]}
          >
            {instruction.step}. {instruction.text}
          </Text>
        ))}

        {recipeData.recipe.tips.length > 0 && (
          <>
            <Text style={[styles.sectionTitle]}>
              Tips
            </Text>
            {recipeData.recipe.tips.map((tip, index) => (
              <Text 
                key={index}
                style={[styles.tip]}
              >
                • {tip}
              </Text>
            ))}
          </>
        )}

        <View style={styles.confirmButtonContainer}>
          {error && (
            <Text style={[styles.errorText]}>
              {error}
            </Text>
          )}
          <Pressable
            style={[
              styles.confirmButton,
              {
                backgroundColor: recipeData.status === 'completed' 
                  ? Colors[colorScheme ?? 'light'].success 
                  : Colors[colorScheme ?? 'light'].accent,
                opacity: recipeData.status === 'completed' ? 0.5 : 1
              }
            ]}
            onPress={handleConfirm}
            disabled={recipeData.status === 'completed' || isProcessing}
          >
            <Text style={styles.confirmButtonText}>
              {recipeData.status === 'completed' 
                ? 'Recipe Confirmed' 
                : isProcessing 
                  ? 'Confirming...' 
                  : 'Confirm Recipe'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { 
            color: '#000000',
            borderColor: '#000000'
          }
        ]}
        placeholder="Briefly describe the meal here..."
        placeholderTextColor={'#000000'}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={2}
      />
      <Pressable
        style={[
          styles.submitButton,
          {
            backgroundColor: prompt.trim() 
              ? Colors[colorScheme ?? 'light'].accent
              : Colors[colorScheme ?? 'light'].border,
            opacity: prompt.trim() ? 1 : 0.5
          }
        ]}
        onPress={handleSubmit}
        disabled={!prompt.trim()}
      >
        <Text style={[styles.submitButtonText, { color: '#000000' }]}>Generate Recipe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#000000',
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
  },
  timingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timing: {
    fontSize: 14,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#000000',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000000',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 12,
    color: '#000000',
  },
  tip: {
    fontSize: 16,
    marginBottom: 4,
    fontStyle: 'italic',
    color: '#000000',
  },
  confirmButtonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  confirmButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },
});
