import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import { BASE_COLORS } from '../constants/colors';

export default function LandingScreen() {
  const handleWriteButtonPress = () => {
    router.push('text');
  };

  const handleTalkButtonPress = () => {
    router.push('record');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground animation="clouds" />
      
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>What's on your mind?</Text>
        
        <Button
          mode="contained"
          onPress={handleWriteButtonPress}
          style={styles.button}
          icon="pencil"
          contentStyle={styles.buttonContent}
        >
          Write to AI
        </Button>

        <Button
          mode="contained"
          onPress={handleTalkButtonPress}
          style={styles.button}
          icon="microphone"
          contentStyle={styles.buttonContent}
        >
          Talk to AI
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    color: BASE_COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    marginVertical: 8,
    borderRadius: 30,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
