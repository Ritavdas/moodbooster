// Color constants for the Mood Booster app

// Base colors
export const BASE_COLORS = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6', // Violet
  accent: '#ec4899', // Pink
  neutral: '#f3f4f6', // Light gray
  background: '#ffffff', // White
  text: '#1f2937', // Dark gray
};

// Mood-based colors
export const MOOD_COLORS = {
  happy: {
    primary: '#fbbf24', // Amber
    secondary: '#f59e0b', // Yellow
    gradient: ['#fbbf24', '#f59e0b'],
  },
  sad: {
    primary: '#60a5fa', // Blue
    secondary: '#3b82f6', // Darker blue
    gradient: ['#60a5fa', '#3b82f6'],
  },
  angry: {
    primary: '#ef4444', // Red
    secondary: '#dc2626', // Darker red
    gradient: ['#ef4444', '#dc2626'],
  },
  neutral: {
    primary: '#9ca3af', // Gray
    secondary: '#6b7280', // Darker gray
    gradient: ['#9ca3af', '#6b7280'],
  },
  calm: {
    primary: '#34d399', // Emerald
    secondary: '#10b981', // Green
    gradient: ['#34d399', '#10b981'],
  },
};
