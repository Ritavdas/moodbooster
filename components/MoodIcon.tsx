import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MoodType } from '../lib/gpt';
import { MOOD_COLORS } from '../constants/colors';

interface MoodIconProps {
  mood: MoodType;
  size?: number;
}

const MoodIcon: React.FC<MoodIconProps> = ({ mood, size = 60 }) => {
  // Get emoji based on mood
  const getEmoji = () => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😔';
      case 'angry':
        return '😠';
      case 'calm':
        return '😌';
      case 'neutral':
      default:
        return '😐';
    }
  };

  // Get color based on mood
  const color = MOOD_COLORS[mood]?.primary || MOOD_COLORS.neutral.primary;

  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: color
      }
    ]}>
      <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>{getEmoji()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    color: 'white',
  },
});

export default MoodIcon;
