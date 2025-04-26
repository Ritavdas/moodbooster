import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { BASE_COLORS } from '../constants/colors';

interface AnimatedBackgroundProps {
  animation?: 'clouds' | 'sunrise';
  mood?: 'happy' | 'sad' | 'angry' | 'neutral' | 'calm';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  animation = 'clouds',
  mood = 'neutral'
}) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Auto-play the animation when component mounts
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  // For now, we'll use a placeholder animation
  // In a real implementation, we would have different animations for different moods
  // and would load the appropriate JSON file
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <LottieView
        ref={lottieRef}
        style={styles.animation}
        source={require('../assets/animations/clouds.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: BASE_COLORS.background,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default AnimatedBackground;
