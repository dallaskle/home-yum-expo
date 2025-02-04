import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function SearchBar({ searchQuery, setSearchQuery, onSearch, loading }: SearchBarProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(SCREEN_WIDTH))[0];

  const toggleSearch = () => {
    const toValue = isSearchVisible ? SCREEN_WIDTH : 0;
    
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
    
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = () => {
    onSearch();
    if (!loading) {
      toggleSearch();
    }
  };

  useEffect(() => {
    // Auto search for healthy recipe ideas on mount
    setSearchQuery('healthy recipe ideas shorts');
    setTimeout(() => {
      onSearch();
    }, 500);
  }, []);

  return (
    <View style={styles.searchWrapper}>
      <TouchableOpacity 
        style={styles.searchIconButton}
        onPress={toggleSearch}
      >
        <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="white" />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.searchAnimatedContainer,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search YouTube videos..."
            placeholderTextColor="#999"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
} 