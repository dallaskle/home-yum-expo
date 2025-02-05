import React, { useState } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useRatingsStore } from '../store/ratings.store';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  mealId?: string;
  mealName: string;
}

export function RatingModal({ visible, onClose, videoId, mealId, mealName }: RatingModalProps) {
  const colorScheme = useColorScheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { rateMeal, isLoading } = useRatingsStore();

  const handleSubmit = async () => {
    try {
      await rateMeal(videoId, rating, mealId, comment);
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: '#333333' }]}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Rate {mealName}
          </Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <FontAwesome
                  name={rating >= star ? 'star' : 'star-o'}
                  size={32}
                  color={Colors[colorScheme ?? 'light'].accent}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Add a comment (optional)"
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].accent }
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || isLoading}
            >
              <Text style={styles.buttonText}>Submit</Text>
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
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 