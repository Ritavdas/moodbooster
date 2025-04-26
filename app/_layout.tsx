import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { BASE_COLORS } from '../constants/colors';

// Create a custom theme based on MD3 Light Theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: BASE_COLORS.primary,
    secondary: BASE_COLORS.accent,
  },
};

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      />
    </PaperProvider>
  );
}
