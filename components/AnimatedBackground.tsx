import React, { useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { BASE_COLORS, MOOD_COLORS } from "../constants/colors";
import { MoodType } from "../lib/gpt";

interface AnimatedBackgroundProps {
	animation?: "clouds" | "sunrise";
	mood?: MoodType;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
	animation = "clouds",
	mood = "neutral",
}) => {
	const lottieRef = useRef<LottieView>(null);

	useEffect(() => {
		// Auto-play the animation when component mounts
		if (lottieRef.current) {
			lottieRef.current.play();
		}
	}, []);

	// Get the gradient colors based on the mood
	const gradientColors = useMemo(() => {
		const colors =
			MOOD_COLORS[mood]?.gradient || MOOD_COLORS.neutral.gradient;
		// Return the first two colors, or fallback to default colors
		return [colors[0] || "#ffffff", colors[1] || "#f3f4f6"] as const;
	}, [mood]);

	// Get the animation source based on the animation type
	const getAnimationSource = () => {
		switch (animation) {
			case "sunrise":
				// In a real app, we would have a sunrise animation
				return require("../assets/animations/clouds.json");
			case "clouds":
			default:
				return require("../assets/animations/clouds.json");
		}
	};

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={gradientColors}
				style={styles.background}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			/>
			<LottieView
				ref={lottieRef}
				style={styles.animation}
				source={getAnimationSource()}
				autoPlay
				loop
			/>
		</View>
	);
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: width,
		height: height,
		zIndex: -1,
	},
	background: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: BASE_COLORS.background,
	},
	animation: {
		width: "100%",
		height: "100%",
	},
});

export default AnimatedBackground;
