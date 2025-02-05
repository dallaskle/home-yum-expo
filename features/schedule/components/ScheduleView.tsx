import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useScheduleStore } from '../store/schedule.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { RatingModal } from '@/features/ratings/components/RatingModal';
import { useRatingsStore } from '@/features/ratings/store/ratings.store';

const getMealPeriod = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  
  if (hour < 11) return 'Breakfast';
  if (hour < 16) return 'Lunch';
  return 'Dinner';
};

export function ScheduleView() {
  const colorScheme = useColorScheme();
  const { scheduledMeals, initialize } = useScheduleStore();
  const [ratingModal, setRatingModal] = useState<{
    visible: boolean;
    videoId: string;
    mealId: string;
    mealName: string;
  } | null>(null);
  const { getRatingForMeal } = useRatingsStore();

  useEffect(() => {
    initialize();
  }, []);

  const getDateLabel = (dateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 0) return 'This Week';
    if (diffWeeks === 1) return 'Next Week';
    return 'Next Month';
  };

  const groupMealsByDate = () => {
    const meals = Object.values(scheduledMeals);
    const sortedMeals = meals.sort((a, b) => {
      const dateCompare = a.mealDate.localeCompare(b.mealDate);
      if (dateCompare === 0) {
        return a.mealTime.localeCompare(b.mealTime);
      }
      return dateCompare;
    });

    const grouped: { [key: string]: typeof meals } = {};
    sortedMeals.forEach(meal => {
      const label = getDateLabel(meal.mealDate);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(meal);
    });

    return grouped;
  };

  const renderMealGroups = () => {
    const groupedMeals = groupMealsByDate();
    const sections = ['Past', 'Today', 'Tomorrow', 'This Week', 'Next Week', 'Next Month'];

    if (Object.keys(groupedMeals).length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
            No meals scheduled
          </Text>
        </View>
      );
    }

    return sections.map(section => {
      const meals = groupedMeals[section];
      if (!meals || meals.length === 0) return null;

      // Filter past meals to only show ones with ratings
      const filteredMeals = section === 'Past' 
        ? meals.filter(meal => !meal.rating)
        : meals;

      if (filteredMeals.length === 0) return null;

      return (
        <View key={section}>
          <Text style={[styles.sectionHeader, { color: Colors[colorScheme ?? 'light'].text }]}>
            {section}
          </Text>
          {filteredMeals.map((meal) => (
            <View 
              key={meal.mealId} 
              style={[
                styles.mealItem,
                section === 'Past' && styles.pastMealItem
              ]}
            >
              <Image
                source={{ uri: meal.video?.thumbnailUrl }}
                style={[
                  styles.thumbnail,
                  section === 'Past' && styles.pastThumbnail
                ]}
              />
              <View style={styles.mealContent}>
                <Text style={[styles.timeText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {getMealPeriod(meal.mealTime)}
                </Text>
                <Text style={[styles.mealTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {meal.video?.mealName}
                </Text>
                <Text style={[styles.mealDescription, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {meal.video?.mealDescription}
                </Text>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setRatingModal({
                    visible: true,
                    videoId: meal.videoId,
                    mealId: meal.mealId,
                    mealName: meal.video?.mealName || 'Unnamed Meal'
                  })}
                >
                  {meal.rating && meal.rating.mealId === meal.mealId ? (
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: meal.rating.rating }, (_, index) => (
                        <FontAwesome
                          key={index}
                          name="star"
                          size={16}
                          color={Colors[colorScheme ?? 'light'].accent}
                        />
                      ))}
                    </View>
                  ) : section === 'Past' || section === 'Today' ? (
                    <View style={styles.ratingContainer}>
                      <FontAwesome
                        name="star-o"
                        size={16}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                      <Text style={[styles.addRatingText, { color: Colors[colorScheme ?? 'light'].text }]}>
                        Add Rating
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      );
    });
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {renderMealGroups()}
      </ScrollView>
      
      {ratingModal && (
        <RatingModal
          visible={ratingModal.visible}
          onClose={() => setRatingModal(null)}
          videoId={ratingModal.videoId}
          mealId={ratingModal.mealId}
          mealName={ratingModal.mealName}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    height: 120,
  },
  thumbnail: {
    width: 120,
    height: 120,
  },
  mealContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  pastMealItem: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pastThumbnail: {
    opacity: 0.5,
  },
  pastText: {
    opacity: 0.7,
  },
  rateButton: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addRatingText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.7,
  },
}); 