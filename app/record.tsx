import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
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
						<Text variant="headlineMedium" style={styles.title}>I'm listening...</Text>
						<Text variant="bodyLarge" style={styles.subtitle}>
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

						<Button
							mode="contained"
							onPress={handleRecordButtonPress}
							style={[styles.button, styles.stopButton]}
							icon="stop"
						>
							Stop Recording
						</Button>
					</>
				);

			case RecordingState.PROCESSING:
				return (
					<>
						<Text variant="headlineMedium" style={styles.title}>Processing...</Text>
						<Text variant="bodyLarge" style={styles.subtitle}>Analyzing your feelings</Text>

						<ActivityIndicator
							animating={true}
							size="large"
							style={styles.loader}
						/>
					</>
				);

			case RecordingState.READY:
			default:
				return (
					<>
						<Text variant="headlineMedium" style={styles.title}>Tell me how you feel</Text>
						<Text variant="bodyLarge" style={styles.subtitle}>
							Tap the button and start speaking
						</Text>

						{errorMessage && (
							<Text variant="bodyMedium" style={styles.errorText}>{errorMessage}</Text>
						)}

						<Button
							mode="contained"
							onPress={handleRecordButtonPress}
							style={styles.button}
							icon="microphone"
						>
							Start Recording
						</Button>

						<Button
							mode="text"
							onPress={() => router.back()}
							style={styles.backButton}
						>
							Go Back
						</Button>
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
		gap: 20,
	},
	title: {
		color: BASE_COLORS.text,
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		color: BASE_COLORS.text,
		textAlign: "center",
		marginBottom: 40,
	},
	button: {
		width: "80%",
		borderRadius: 30,
	},
	stopButton: {
		backgroundColor: BASE_COLORS.accent,
	},
	backButton: {
		marginTop: 20,
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
