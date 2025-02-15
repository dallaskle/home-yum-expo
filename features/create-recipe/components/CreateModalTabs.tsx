import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CreateModalTabsProps {
  activeTab: 'link' | 'manual';
  onTabChange: (tab: 'link' | 'manual') => void;
}

export function CreateModalTabs({ activeTab, onTabChange }: CreateModalTabsProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.tab,
          activeTab === 'link' && styles.activeTab,
          { borderColor: Colors[colorScheme ?? 'light'].border }
        ]}
        onPress={() => onTabChange('link')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'link' && styles.activeTabText,
            { color: activeTab === 'link' ? Colors[colorScheme ?? 'light'].accent : 'black' }
          ]}
        >
          With a Link
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tab,
          activeTab === 'manual' && styles.activeTab,
          { borderColor: Colors[colorScheme ?? 'light'].border }
        ]}
        onPress={() => onTabChange('manual')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'manual' && styles.activeTabText,
            { color: activeTab === 'manual' ? Colors[colorScheme ?? 'light'].accent : 'black' }
          ]}
        >
          Manually
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.light.accent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.light.accent,
  },
}); 