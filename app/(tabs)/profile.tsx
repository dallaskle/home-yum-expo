import React from 'react';
import { View } from 'react-native';
import { ProfileScreen } from '@/features/profile/components/ProfileScreen';

export default function ProfileTab() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen />
    </View>
  );
} 