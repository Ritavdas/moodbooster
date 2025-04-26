import { MoodType } from './gpt';
import { MOOD_COLORS } from '../constants/colors';

// Get color based on mood
export function getMoodColor(mood: MoodType): string {
  return MOOD_COLORS[mood]?.primary || MOOD_COLORS.neutral.primary;
}

// Get gradient colors based on mood
export function getMoodGradient(mood: MoodType): string[] {
  return MOOD_COLORS[mood]?.gradient || MOOD_COLORS.neutral.gradient;
}

// Get a friendly description of the mood
export function getMoodDescription(mood: MoodType): string {
  switch (mood) {
    case 'happy':
      return 'You sound happy and positive!';
    case 'sad':
      return 'You seem a bit down today.';
    case 'angry':
      return 'I can sense some frustration in your words.';
    case 'calm':
      return 'You have a peaceful energy about you.';
    case 'neutral':
    default:
      return 'I hear you.';
  }
}
