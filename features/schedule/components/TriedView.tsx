import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useScheduleStore } from '../store/schedule.store';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';

const getMealPeriod = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  
  if (hour < 11) return 'Breakfast';
  if (hour < 16) return 'Lunch';
  return 'Dinner';
};

export function TriedView() {
  const colorScheme = useColorScheme();
  const { scheduledMeals } = useScheduleStore();

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatedMeals = () => {
    const meals = Object.values(scheduledMeals)
      .filter(meal => meal.rating) // Only get meals with ratings
      .sort((a, b) => {
        // Sort by date in reverse chronological order
        return new Date(b.mealDate).getTime() - new Date(a.mealDate).getTime();
      });

    return meals;
  };

  const getDateLabel = (dateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return 'This Week';
    if (diffDays <= 14) return 'Last Week';
    return 'Earlier';
  };

  const groupMealsByDate = () => {
    const meals = getRatedMeals();
    const grouped: { [key: string]: typeof meals } = {};
    
    meals.forEach(meal => {
      const label = getDateLabel(meal.mealDate);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(meal);
    });

    return grouped;
  };

  const renderMeals = () => {
    const groupedMeals = groupMealsByDate();
    const sections = ['Today', 'Yesterday', 'This Week', 'Last Week', 'Earlier'];

    if (Object.keys(groupedMeals).length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
            No rated meals yet
          </Text>
        </View>
      );
    }

    return sections.map(section => {
      const meals = groupedMeals[section];
      if (!meals || meals.length === 0) return null;

      return (
        <View key={section}>
          <Text style={[styles.sectionHeader, { color: Colors[colorScheme ?? 'light'].text }]}>
            {section}
          </Text>
          {meals.map((meal) => (
            <View key={meal.mealId} style={styles.mealItem}>
              <Image
                source={{ uri: meal.video?.thumbnailUrl }}
                style={styles.thumbnail}
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
                <View style={styles.bottomRow}>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: meal.rating?.rating || 0 }, (_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={16}
                        color={Colors[colorScheme ?? 'light'].accent}
                      />
                    ))}
                  </View>
                  <Text style={[styles.dateText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {formatDate(meal.mealDate)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderMeals()}
    </ScrollView>
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
}); 