import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { CreateRecipeForm } from '@/features/create-recipe/components/CreateRecipeForm';
import { useCreateRecipeStore } from '@/features/create-recipe/store/create-recipe.store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

const POLLING_INTERVAL = 2000; // 2 seconds

export function CreateModal({ visible, onClose, slideAnim }: CreateModalProps) {
  const colorScheme = useColorScheme();
  const { startProcessing, reset, isProcessing, status, progress, checkStatus, currentLogId } = useCreateRecipeStore();
  const successAnim = useRef(new Animated.Value(0)).current;
  const pollingInterval = useRef<NodeJS.Timeout>();

  // Handle success animation
  useEffect(() => {
    if (status === 'completed') {
      Animated.sequence([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (status === 'completed') {
          handleClose();
        }
      });
    }
  }, [status]);

  // Handle polling
  useEffect(() => {
    if (isProcessing && currentLogId) {
      // Start polling
      pollingInterval.current = setInterval(async () => {
        await checkStatus();
      }, POLLING_INTERVAL);
    }

    // Cleanup function
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = undefined;
      }
    };
  }, [isProcessing, currentLogId]);

  // Stop polling when status is completed or failed
  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = undefined;
      }
    }
  }, [status]);

  const handleSubmit = async () => {
    // Clear any existing polling
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = undefined;
    }
    await startProcessing();
  };

  const handleClose = () => {
    // Clear polling on close
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = undefined;
    }
    reset();
    onClose();
  };

  const getButtonText = () => {
    if (isProcessing) {
      return `Processing... ${progress}%`;
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = undefined;
      }
    };
  }, []);

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
        
        <Animated.View style={[styles.successOverlay, { opacity: successAnim }]}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={64} 
            color={Colors[colorScheme ?? 'light'].success} 
          />
          <Text style={[styles.successText, { color: Colors[colorScheme ?? 'light'].success }]}>
            Recipe Added Successfully!
          </Text>
        </Animated.View>
        
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
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
}); 