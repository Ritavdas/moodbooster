import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Text, Card, Surface } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import { BASE_COLORS } from '../constants/colors';
import { MoodType } from '../lib/gpt';
import { getMoodDescription } from '../lib/utils';

export default function ResponseScreen() {
  // Get the mood analysis results from the URL params
  const params = useLocalSearchParams<{
    mood: MoodType;
    message: string;
    transcription: string;
  }>();

  const mood = params.mood as MoodType || 'neutral';
  const message = params.message ? decodeURIComponent(params.message) : '';
  const transcription = params.transcription ? decodeURIComponent(params.transcription) : '';

  // Log the received data
  useEffect(() => {
    console.log('Mood:', mood);
    console.log('Message:', message);
    console.log('Transcription:', transcription);
  }, [mood, message, transcription]);

  // Handle the "Talk Again" button press
  const handleTalkAgainPress = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground animation="clouds" mood={mood} />
      
      <View style={styles.content}>
        <Surface style={styles.cardContainer} elevation={1}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.moodTitle}>
                {getMoodDescription(mood)}
              </Text>
              
              <Text variant="bodyLarge" style={styles.message}>
                {message}
              </Text>
              
              {transcription && (
                <View style={styles.transcriptionContainer}>
                  <Text variant="labelLarge" style={styles.transcriptionLabel}>
                    You said:
                  </Text>
                  <Text variant="bodyMedium" style={styles.transcription}>
                    {transcription}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Surface>
        
        <Button
          mode="contained"
          onPress={handleTalkAgainPress}
          style={styles.button}
          icon="chat"
        >
          Talk Again!
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
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    backgroundColor: 'transparent',
  },
  moodTitle: {
    color: BASE_COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: BASE_COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  transcriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 16,
  },
  transcriptionLabel: {
    color: BASE_COLORS.text,
    marginBottom: 8,
  },
  transcription: {
    color: BASE_COLORS.text,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 30,
    borderRadius: 30,
    width: '80%',
  },
});
