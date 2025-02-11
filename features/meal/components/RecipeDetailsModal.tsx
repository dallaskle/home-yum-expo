import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { useMealStore } from '../store/meal.store';

type TabType = 'ingredients' | 'instructions' | 'nutrition';

interface RecipeDetailsModalProps {
  visible: boolean;
  videoId: string;
  onClose: () => void;
}

export function RecipeDetailsModal({ visible, videoId, onClose }: RecipeDetailsModalProps) {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');
  const { recipe, recipeItems, ingredients, nutrition, isLoading, error, fetchRecipeData, generateRecipeData } = useMealStore();

  useEffect(() => {
    if (visible && videoId) {
      fetchRecipeData(videoId);
    }
  }, [visible, videoId]);

  const handleGenerateRecipe = async () => {
    try {
      await generateRecipeData(videoId);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
        No recipe data available
      </Text>
      <TouchableOpacity
        style={[styles.generateButton, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
        onPress={handleGenerateRecipe}
      >
        <Text style={styles.generateButtonText}>Generate Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIngredients = () => {
    if (ingredients.length === 0) {
      return renderEmptyState();
    }

    return ingredients.map((ingredient, index) => (
      <View key={ingredient.ingredientId} style={styles.ingredientItem}>
        <Text style={[styles.ingredientText, { color: Colors[colorScheme ?? 'light'].text }]}>
          • {ingredient.amount} {ingredient.amountDescription} {ingredient.name}
        </Text>
        <Text style={[styles.nutritionSubtext, { color: Colors[colorScheme ?? 'light'].text }]}>
          {ingredient.calories} cal | {ingredient.protein}g protein | {ingredient.carbs}g carbs | {ingredient.fat}g fat
        </Text>
      </View>
    ));
  };

  const renderInstructions = () => {
    if (recipeItems.length === 0) {
      return renderEmptyState();
    }

    const sortedItems = [...recipeItems].sort((a, b) => a.stepOrder - b.stepOrder);
    return sortedItems.map((item) => (
      <View key={item.recipeItemId} style={styles.instructionItem}>
        <Text style={[styles.stepNumber, { color: Colors[colorScheme ?? 'light'].accent }]}>
          {item.stepOrder}
        </Text>
        <View style={styles.instructionContent}>
          <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.instruction}
          </Text>
          {item.additionalDetails && (
            <Text style={[styles.additionalDetails, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.additionalDetails}
            </Text>
          )}
        </View>
      </View>
    ));
  };

  const renderNutrition = () => {
    if (!nutrition) {
      return renderEmptyState();
    }

    const nutritionItems = [
      { label: 'Calories', value: nutrition.calories },
      { label: 'Fat', value: `${nutrition.fat}g` },
      { label: 'Protein', value: `${nutrition.protein}g` },
      { label: 'Carbs', value: `${nutrition.carbs}g` },
      { label: 'Fiber', value: `${nutrition.fiber}g` },
    ];

    return (
      <>
        <View style={styles.nutritionSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Total Nutrition (Serving Size: {nutrition.serving_sizes})
          </Text>
          {nutritionItems.map((item) => (
            <View key={item.label} style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                {item.label}
              </Text>
              <Text style={[styles.nutritionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: '#333333' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              {recipe?.title || 'Recipe Details'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome 
                name="times" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'ingredients' && styles.activeTab,
                activeTab === 'ingredients' && { borderBottomColor: Colors[colorScheme ?? 'light'].accent }
              ]}
              onPress={() => setActiveTab('ingredients')}
            >
              <FontAwesome
                name="list"
                size={20}
                color={activeTab === 'ingredients' ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'instructions' && styles.activeTab,
                activeTab === 'instructions' && { borderBottomColor: Colors[colorScheme ?? 'light'].accent }
              ]}
              onPress={() => setActiveTab('instructions')}
            >
              <FontAwesome
                name="book"
                size={20}
                color={activeTab === 'instructions' ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'nutrition' && styles.activeTab,
                activeTab === 'nutrition' && { borderBottomColor: Colors[colorScheme ?? 'light'].accent }
              ]}
              onPress={() => setActiveTab('nutrition')}
            >
              <FontAwesome
                name="heartbeat"
                size={20}
                color={activeTab === 'nutrition' ? Colors[colorScheme ?? 'light'].accent : Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].accent} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {error}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
              {activeTab === 'ingredients' && renderIngredients()}
              {activeTab === 'instructions' && renderInstructions()}
              {activeTab === 'nutrition' && renderNutrition()}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 102, 0, 0.2)',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 20,
  },
  ingredientItem: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
  },
  nutritionSubtext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  additionalDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  nutritionLabel: {
    fontSize: 16,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  generateButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
}); 