import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Animated, KeyboardAvoidingView, ScrollView, Platform, Keyboard } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { CreateRecipeForm } from '@/features/create-recipe/components/CreateRecipeForm';
import { useCreateRecipeStore } from '@/features/create-recipe/store/create-recipe.store';
import { CreateModalTabs } from '@/features/create-recipe/components/CreateModalTabs';
import { CreateManualRecipeForm } from '@/features/manual-recipe/components/CreateManualRecipeForm';
import { useManualRecipeStore } from '@/features/manual-recipe/store/manual-recipe.store';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export function CreateModal({ visible, onClose, slideAnim }: CreateModalProps) {
  const colorScheme = useColorScheme();
  const { reset: resetCreateRecipe, status: createRecipeStatus } = useCreateRecipeStore();
  const { reset: resetManualRecipe } = useManualRecipeStore();
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<'link' | 'manual'>('link');
  
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

  const handleClose = () => {
    if (createRecipeStatus === 'completed') {
      resetCreateRecipe();
      useCreateRecipeStore.setState({
        videoUrl: '',
        isProcessing: false,
        error: null,
        status: 'idle',
        processingSteps: []
      });
    }
    resetManualRecipe();
    onClose();
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
              { translateY: Animated.multiply(keyboardHeight, 0) }
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
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Add a New Recipe
          </Text>
          
          <CreateModalTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {activeTab === 'link' ? (
            <CreateRecipeForm onSuccess={handleClose} />
          ) : (
            <CreateManualRecipeForm />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
}); 