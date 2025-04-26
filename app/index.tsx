import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import { BASE_COLORS } from '../constants/colors';

export default function LandingScreen() {
  const handleTalkButtonPress = () => {
    // Navigate to the recording screen
    router.push('/record');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground animation="clouds" />
      
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleTalkButtonPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Talk to Me 🎤</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BASE_COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: BASE_COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
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
