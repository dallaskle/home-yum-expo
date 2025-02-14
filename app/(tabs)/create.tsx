import React from 'react';
import { View, StyleSheet, Text, ScrollView, Platform } from 'react-native';
import { CreateRecipeForm } from '@/features/create-recipe/components/CreateRecipeForm';
import { CreateManualRecipeForm } from '@/features/manual-recipe/components/CreateManualRecipeForm';
import { CreateModalTabs } from '@/features/create-recipe/components/CreateModalTabs';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function CreateTab() {
  const [activeTab, setActiveTab] = useState<'link' | 'manual'>('link');
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <CreateRecipeForm onSuccess={() => {}} />
        ) : (
          <CreateManualRecipeForm onSuccess={() => {}} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 72,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
}); 