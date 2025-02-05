import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image as RNImage, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useRatingsStore } from '@/features/ratings/store/ratings.store';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHT = 120;

type SortOption = 'recent' | 'highest' | 'lowest';

export function RatedVideosTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const { aggregatedRatings, isLoading, initialize } = useRatingsStore();
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].accent} />
      </View>
    );
  }

  if (aggregatedRatings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="star" size={48} color={Colors[colorScheme].text} style={styles.emptyIcon} />
        <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
          No rated videos yet
        </Text>
      </View>
    );
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortedRatings = () => {
    return [...aggregatedRatings].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastRated).getTime() - new Date(a.lastRated).getTime();
        case 'highest':
          return b.averageRating - a.averageRating;
        case 'lowest':
          return a.averageRating - b.averageRating;
        default:
          return 0;
      }
    });
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'recent':
        return 'Most Recent';
      case 'highest':
        return 'Highest Rated';
      case 'lowest':
        return 'Lowest Rated';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Pressable
            style={styles.sortButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Text style={[styles.sortButtonText, { color: Colors[colorScheme].text }]}>
              Sort: {getSortLabel()}
            </Text>
            <FontAwesome
              name={showMenu ? "chevron-up" : "chevron-down"}
              size={12}
              color={Colors[colorScheme].text}
              style={{ marginLeft: 4 }}
            />
          </Pressable>
          
          {showMenu && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setSortBy('recent');
                  setShowMenu(false);
                }}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme].text }]}>Most Recent</Text>
              </Pressable>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setSortBy('highest');
                  setShowMenu(false);
                }}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme].text }]}>Highest Rated</Text>
              </Pressable>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setSortBy('lowest');
                  setShowMenu(false);
                }}
              >
                <Text style={[styles.dropdownText, { color: Colors[colorScheme].text }]}>Lowest Rated</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {getSortedRatings().map((rating) => (
          <View key={rating.videoId} style={styles.card}>
            <RNImage
              source={{ uri: rating.video.thumbnailUrl?.replace(/\?$/, '') }}
              style={styles.thumbnail}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.mealTitle, { color: Colors[colorScheme].text }]} numberOfLines={1}>
                {rating.video.mealName}
              </Text>
              <Text style={[styles.mealDescription, { color: Colors[colorScheme].text }]} numberOfLines={2}>
                {rating.video.mealDescription}
              </Text>
              <View style={styles.ratingSection}>
                <View style={styles.ratingContainer}>
                  {Array.from({ length: Math.round(rating.averageRating) }, (_, index) => (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={16}
                      color={Colors[colorScheme].accent}
                    />
                  ))}
                  <Text style={[styles.ratingText, { color: Colors[colorScheme].text }]}>
                    {rating.averageRating.toFixed(1)} from {rating.numberOfRatings} rating{rating.numberOfRatings === 1 ? '' : 's'}
                  </Text>
                </View>
                <Text style={[styles.dateText, { color: Colors[colorScheme].text }]}>
                  Last rated {formatDate(rating.lastRated)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#444444',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownText: {
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    height: CARD_HEIGHT,
  },
  thumbnail: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  ratingSection: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  loaderContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 