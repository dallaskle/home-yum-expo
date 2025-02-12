import React from 'react';
import { View, StyleSheet, Text, TextInput, Image, ScrollView, Pressable } from 'react-native';
import { useManualRecipeStore } from '../store/manual-recipe.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ProgressTracker } from '@/components/ProgressTracker';

export function CreateManualRecipeForm() {
  const colorScheme = useColorScheme();
  const [prompt, setPrompt] = React.useState('');
  const { 
    isProcessing,
    status,
    currentStep,
    processingSteps,
    recipeData,
    startProcessing
  } = useManualRecipeStore();

  const handleSubmit = async () => {
    if (prompt.trim()) {
      await startProcessing(prompt.trim());
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
          {processingSteps[currentStep]}...
        </Animated.Text>
      </View>
    );
  }

  if (recipeData) {
    return (
      <ScrollView style={styles.previewContainer}>
        <Image 
          source={{ uri: recipeData.mealImage.url }}
          style={styles.previewImage}
        />
        
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          {recipeData.recipe.title}
        </Text>
        
        <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].text }]}>
          {recipeData.recipe.description}
        </Text>
        
        <View style={styles.timingContainer}>
          <Text style={[styles.timing, { color: Colors[colorScheme ?? 'light'].text }]}>
            Prep: {recipeData.recipe.prepTime} mins
          </Text>
          <Text style={[styles.timing, { color: Colors[colorScheme ?? 'light'].text }]}>
            Cook: {recipeData.recipe.cookTime} mins
          </Text>
          <Text style={[styles.timing, { color: Colors[colorScheme ?? 'light'].text }]}>
            Serves: {recipeData.recipe.servings}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Ingredients
        </Text>
        {recipeData.recipe.ingredients.map((ingredient, index) => (
          <Text 
            key={index}
            style={[styles.ingredient, { color: Colors[colorScheme ?? 'light'].text }]}
          >
            • {ingredient.amount} {ingredient.amountDescription} {ingredient.name}
          </Text>
        ))}

        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Instructions
        </Text>
        {recipeData.recipe.instructions.map((instruction) => (
          <Text 
            key={instruction.step}
            style={[styles.instruction, { color: Colors[colorScheme ?? 'light'].text }]}
          >
            {instruction.step}. {instruction.text}
          </Text>
        ))}

        {recipeData.recipe.tips.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Tips
            </Text>
            {recipeData.recipe.tips.map((tip, index) => (
              <Text 
                key={index}
                style={[styles.tip, { color: Colors[colorScheme ?? 'light'].text }]}
              >
                • {tip}
              </Text>
            ))}
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { 
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].border
          }
        ]}
        placeholder="Briefly describe the meal here..."
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={2}
      />
      <Pressable
        style={[
          styles.submitButton,
          {
            backgroundColor: prompt.trim() ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].border,
            opacity: prompt.trim() ? 1 : 0.5
          }
        ]}
        onPress={handleSubmit}
        disabled={!prompt.trim()}
      >
        <Text style={styles.submitButtonText}>Generate Recipe</Text>
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
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  timingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timing: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 12,
  },
  tip: {
    fontSize: 16,
    marginBottom: 4,
    fontStyle: 'italic',
  },
});
