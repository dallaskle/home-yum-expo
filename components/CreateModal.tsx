import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated, KeyboardAvoidingView, ScrollView, Platform, Keyboard } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { CreateRecipeForm } from '@/features/create-recipe/components/CreateRecipeForm';
import { useCreateRecipeStore } from '@/features/create-recipe/store/create-recipe.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressTracker } from './ProgressTracker';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export function CreateModal({ visible, onClose, slideAnim }: CreateModalProps) {
  const colorScheme = useColorScheme();
  const { 
    startProcessing, 
    reset, 
    isProcessing, 
    status,
    processingSteps,
  } = useCreateRecipeStore();
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSubmit = async () => {
    await startProcessing(() => {
      // Close modal after a short delay to show success state
      setTimeout(() => {
        handleClose();
      }, 1500);
    });
  };

  const handleClose = () => {
    reset();
    onClose();
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

  if (!visible) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.overlay}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            transform: [
              { translateY: slideAnim },
              { translateY: Animated.multiply(keyboardHeight,0) }
            ]
          }
        ]}
      >
        <View style={styles.handle} />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === 'ios' ? 20 : 0 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {isProcessing ? (
            <ProgressTracker 
              steps={processingSteps} 
            />
          ) : (
            <>
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
                  { backgroundColor: getButtonColor() },
                  isProcessing && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isProcessing}
              >
                <Text style={styles.buttonText}>
                  {getButtonText()}
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
    opacity: 0.7,
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
  scrollContent: {
    flexGrow: 1,
  },
}); 