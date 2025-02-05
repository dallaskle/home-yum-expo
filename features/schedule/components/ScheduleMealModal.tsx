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
type WeekTab = 'this' | 'next';

export function ScheduleMealModal({ visible, videoId, onClose }: ScheduleMealModalProps) {
  const colorScheme = useColorScheme();
  const { scheduleMeal } = useScheduleStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<MealPeriod>('Dinner');
  const [weekTab, setWeekTab] = useState<WeekTab>('this');

  const getWeekDays = (isNextWeek: boolean) => {
    const today = new Date();
    const days = [];
    
    // Get to Monday of current week
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days
    
    // Start from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      const daysToAdd = mondayOffset + i + (isNextWeek ? 7 : 0);
      date.setDate(today.getDate() + daysToAdd);
      days.push(date);
    }

    return days;
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const formatDayLabel = (date: Date) => {
    const days = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat'];
    return days[date.getDay()];
  };

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleSchedule = async () => {
    try {
      await scheduleMeal(
        videoId, 
        selectedDate.toISOString().split('T')[0], 
        MEAL_PERIODS[selectedMealPeriod]
      );
      onClose();
    } catch (error) {
      console.error('Failed to schedule meal:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Schedule Meal
          </Text>

          <View style={styles.weekTabContainer}>
            <TouchableOpacity
              style={[
                styles.weekTab,
                styles.leftTab,
                weekTab === 'this' && styles.selectedWeekTab,
              ]}
              onPress={() => setWeekTab('this')}
            >
              <Text style={[
                styles.weekTabText,
                weekTab === 'this' && styles.selectedWeekTabText
              ]}>
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.weekTab,
                styles.rightTab,
                weekTab === 'next' && styles.selectedWeekTab,
              ]}
              onPress={() => setWeekTab('next')}
            >
              <Text style={[
                styles.weekTabText,
                weekTab === 'next' && styles.selectedWeekTabText
              ]}>
                Next Week
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[
            styles.calendarContainer,
          ]}>
            <View style={styles.weekdayRow}>
              {getWeekDays(weekTab === 'next').slice(0, 5).map((date, index) => (
                isDateSelectable(date) && (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      isDateSelected(date) && styles.selectedDay
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dayText, isDateSelected(date) && styles.selectedDayText]}>
                      {formatDayLabel(date)}
                    </Text>
                  </TouchableOpacity>
                )
              ))}
            </View>
            <View style={styles.weekendRow}>
              {getWeekDays(weekTab === 'next').slice(5).map((date, index) => (
                isDateSelectable(date) && (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      isDateSelected(date) && styles.selectedDay
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dayText, isDateSelected(date) && styles.selectedDayText]}>
                      {formatDayLabel(date)}
                    </Text>
                  </TouchableOpacity>
                )
              ))}
            </View>
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
                  <Text style={[styles.dayText, selectedMealPeriod === period && styles.selectedDayText]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.scheduleButton]} onPress={handleSchedule}>
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
  weekTabContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -1,
    zIndex: 1,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  leftTab: {
    marginRight: -10,
  },
  rightTab: {
    marginLeft: -10,
  },
  selectedWeekTab: {
    borderBottomColor: Colors.light.accent,
    backgroundColor: 'transparent',
    shadowColor: Colors.light.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  weekTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.4,
  },
  selectedWeekTabText: {
    opacity: 1,
  },
  calendarContainer: {
    marginBottom: 20,
    padding: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 0,
  },
  weekendRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    flex: 1,
    maxWidth: '33%',
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