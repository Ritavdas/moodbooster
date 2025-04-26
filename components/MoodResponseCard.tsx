import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodType } from '../lib/gpt';
import { BASE_COLORS } from '../constants/colors';
import MoodIcon from './MoodIcon';
import { getMoodDescription } from '../lib/utils';

interface MoodResponseCardProps {
  mood: MoodType;
  message: string;
  transcription?: string;
}

const MoodResponseCard: React.FC<MoodResponseCardProps> = ({
  mood,
  message,
  transcription,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <MoodIcon mood={mood} size={50} />
        <Text style={styles.moodTitle}>{getMoodDescription(mood)}</Text>
      </View>
      
      <Text style={styles.message}>{message}</Text>
      
      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>You said:</Text>
          <Text style={styles.transcription}>{transcription}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  moodTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BASE_COLORS.text,
    marginLeft: 16,
    flex: 1,
  },
  message: {
    fontSize: 18,
    color: BASE_COLORS.text,
    lineHeight: 26,
    marginBottom: 24,
  },
  transcriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BASE_COLORS.text,
    marginBottom: 8,
  },
  transcription: {
    fontSize: 14,
    color: BASE_COLORS.text,
    fontStyle: 'italic',
  },
});

export default MoodResponseCard;
