import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useScheduleStore } from '../store/schedule.store';

interface ScheduleMealModalProps {
  visible: boolean;
  videoId: string;
  onClose: () => void;
}

const MEAL_PERIODS = {
  Breakfast: '08:00',
  Lunch: '12:00',
  Dinner: '18:00'
} as const;

type MealPeriod = keyof typeof MEAL_PERIODS;

export function ScheduleMealModal({ visible, videoId, onClose }: ScheduleMealModalProps) {
  const colorScheme = useColorScheme();
  const { scheduleMeal } = useScheduleStore();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<MealPeriod>('Dinner');

  const days = ['Today', 'Tomorrow', 'Day After'];

  const getDateString = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const handleSchedule = async () => {
    try {
      await scheduleMeal(videoId, getDateString(selectedDay), MEAL_PERIODS[selectedMealPeriod]);
      onClose();
    } catch (error) {
      console.error('Failed to schedule meal:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Schedule Meal
          </Text>
          
          <View style={styles.daySelector}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDay === index && styles.selectedDay
                ]}
                onPress={() => setSelectedDay(index)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDay === index && styles.selectedDayText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timeContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Meal Time
            </Text>
            <View style={[styles.mealPeriodSelector, styles.daySelector]}>
              {(Object.keys(MEAL_PERIODS) as MealPeriod[]).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.dayButton,
                    selectedMealPeriod === period && styles.selectedDay
                  ]}
                  onPress={() => setSelectedMealPeriod(period)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedMealPeriod === period && styles.selectedDayText
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.scheduleButton]}
              onPress={handleSchedule}
            >
              <Text style={styles.buttonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: Colors.light.accent,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  selectedDayText: {
    opacity: 1,
  },
  timeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  mealPeriodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealPeriodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  selectedMealPeriod: {
    backgroundColor: Colors.light.accent,
  },
  mealPeriodText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  selectedMealPeriodText: {
    opacity: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleButton: {
    backgroundColor: Colors.light.accent,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 