import React from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { CreateRecipeForm } from '@/features/create-recipe/components/CreateRecipeForm';
import { useCreateRecipeStore } from '@/features/create-recipe/store/create-recipe.store';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export function CreateModal({ visible, onClose, slideAnim }: CreateModalProps) {
  const colorScheme = useColorScheme();
  const { startProcessing, reset, isProcessing } = useCreateRecipeStore();

  const handleSubmit = async () => {
    await startProcessing();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.handle} />
        
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Add a New Recipe
        </Text>
        
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

        <CreateRecipeForm />
        
        <Pressable
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].accent },
            isProcessing && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Add Recipe'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#999',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
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
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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