import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
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
        <View style={styles.card}>
          <Text style={styles.moodTitle}>{getMoodDescription(mood)}</Text>
          
          <Text style={styles.message}>{message}</Text>
          
          {transcription && (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.transcriptionLabel}>You said:</Text>
              <Text style={styles.transcription}>{transcription}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleTalkAgainPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Talk Again!</Text>
        </TouchableOpacity>
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
  moodTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BASE_COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: BASE_COLORS.text,
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'center',
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
  button: {
    backgroundColor: BASE_COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
