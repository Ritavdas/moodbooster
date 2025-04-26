import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import AnimatedBackground from "../components/AnimatedBackground";
import { BASE_COLORS } from "../constants/colors";
import { VoiceRecorder } from "../lib/deepgram";
import { getMockMoodAnalysis } from "../lib/gpt";

// Recording states
enum RecordingState {
	READY = "ready",
	RECORDING = "recording",
	PROCESSING = "processing",
}

export default function RecordScreen() {
	// State for recording status
	const [recordingState, setRecordingState] = useState<RecordingState>(
		RecordingState.READY
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Reference to the voice recorder
	const voiceRecorderRef = useRef<VoiceRecorder | null>(null);
	// Reference to the Lottie animation
	const lottieRef = useRef<LottieView>(null);

	// Initialize voice recorder
	useEffect(() => {
		voiceRecorderRef.current = new VoiceRecorder();

		// Cleanup on unmount
		return () => {
			if (voiceRecorderRef.current) {
				voiceRecorderRef.current.cleanup();
			}
		};
	}, []);

	// Start recording function
	const startRecording = async () => {
		try {
			setErrorMessage(null);
			setRecordingState(RecordingState.RECORDING);

			if (voiceRecorderRef.current) {
				await voiceRecorderRef.current.startRecording();
			}
		} catch (error) {
			console.error("Failed to start recording:", error);
			setErrorMessage(
				"Could not access microphone. Please check permissions."
			);
			setRecordingState(RecordingState.READY);
		}
	};

	// Stop recording and process audio
	const stopRecording = async () => {
		try {
			setRecordingState(RecordingState.PROCESSING);

			if (voiceRecorderRef.current) {
				await voiceRecorderRef.current.stopRecording();

				// For demo purposes, use mock transcription
				const transcription =
					await voiceRecorderRef.current.getMockTranscription();
				console.log("Transcription:", transcription);

				// Analyze mood with mock GPT
				const moodAnalysis = await getMockMoodAnalysis(transcription);
				console.log("Mood analysis:", moodAnalysis);

				// Navigate to response screen with the results
				router.push({
					pathname: "/response",
					params: {
						mood: moodAnalysis.mood,
						message: encodeURIComponent(moodAnalysis.message),
						transcription: encodeURIComponent(transcription),
					},
				});
			}
		} catch (error) {
			console.error("Failed to process recording:", error);
			setErrorMessage("Something went wrong while processing your voice.");
			setRecordingState(RecordingState.READY);
		}
	};

	// Handle the record button press
	const handleRecordButtonPress = () => {
		if (recordingState === RecordingState.READY) {
			startRecording();
		} else if (recordingState === RecordingState.RECORDING) {
			stopRecording();
		}
	};

	// Render different content based on recording state
	const renderContent = () => {
		switch (recordingState) {
			case RecordingState.RECORDING:
				return (
					<>
						<Text style={styles.title}>I'm listening...</Text>
						<Text style={styles.subtitle}>
							Speak about how you're feeling
						</Text>

						<View style={styles.animationContainer}>
							<LottieView
								ref={lottieRef}
								style={styles.micAnimation}
								source={require("../assets/animations/mic.json")}
								autoPlay
								loop
							/>
						</View>

						<TouchableOpacity
							style={[styles.button, styles.stopButton]}
							onPress={handleRecordButtonPress}
							activeOpacity={0.8}
						>
							<Text style={styles.buttonText}>Stop Recording</Text>
						</TouchableOpacity>
					</>
				);

			case RecordingState.PROCESSING:
				return (
					<>
						<Text style={styles.title}>Processing...</Text>
						<Text style={styles.subtitle}>Analyzing your feelings</Text>

						<ActivityIndicator
							size="large"
							color={BASE_COLORS.primary}
							style={styles.loader}
						/>
					</>
				);

			case RecordingState.READY:
			default:
				return (
					<>
						<Text style={styles.title}>Tell me how you feel</Text>
						<Text style={styles.subtitle}>
							Tap the button and start speaking
						</Text>

						{errorMessage && (
							<Text style={styles.errorText}>{errorMessage}</Text>
						)}

						<TouchableOpacity
							style={styles.button}
							onPress={handleRecordButtonPress}
							activeOpacity={0.8}
						>
							<Text style={styles.buttonText}>Start Recording 🎤</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
							activeOpacity={0.8}
						>
							<Text style={styles.backButtonText}>Go Back</Text>
						</TouchableOpacity>
					</>
				);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<AnimatedBackground animation="clouds" />

			<View style={styles.content}>{renderContent()}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: BASE_COLORS.text,
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: BASE_COLORS.text,
		textAlign: "center",
		marginBottom: 40,
	},
	button: {
		backgroundColor: BASE_COLORS.primary,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	stopButton: {
		backgroundColor: BASE_COLORS.accent,
	},
	buttonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	backButton: {
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	backButtonText: {
		color: BASE_COLORS.text,
		fontSize: 16,
		textAlign: "center",
	},
	errorText: {
		color: "red",
		marginBottom: 20,
		textAlign: "center",
	},
	animationContainer: {
		width: 200,
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 30,
	},
	micAnimation: {
		width: "100%",
		height: "100%",
	},
	loader: {
		marginVertical: 40,
	},
});
