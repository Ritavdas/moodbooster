import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import base64 from "base-64";

// Define types
export type AgentMessage = {
	role: "user" | "assistant";
	content: string;
	timestamp: number;
};

export type VoiceAgentController = {
	sendInitialInstructions: (initialInstructions: string) => Promise<void>;
	setInitialConversationPhrases: (
		phrases: {
			role: "user" | "assistant";
			text: string;
		}[]
	) => Promise<void>;
	makeAgentSay: (text: string, instructions?: string) => Promise<void>;
	startConversation: () => Promise<void>;
};

export type UseAgentProps = {
	onBeforeStarting: () => void;
	onStarted: (vac: VoiceAgentController) => void;
	onAfterStarted: () => void;
	onError: (err: unknown) => void;
	onEnd: () => void;
	onMessage: (event: AgentMessage) => void;
};

type AgentEvents = {
	SettingsApplied: "SettingsApplied";
	ConversationText: "ConversationText";
	UserStartedSpeaking: "UserStartedSpeaking";
	AgentThinking: "AgentThinking";
	AgentStartedSpeaking: "AgentStartedSpeaking";
};

// Agent events constants
const AgentEvents: AgentEvents = {
	SettingsApplied: "SettingsApplied",
	ConversationText: "ConversationText",
	UserStartedSpeaking: "UserStartedSpeaking",
	AgentThinking: "AgentThinking",
	AgentStartedSpeaking: "AgentStartedSpeaking",
};

// WebSocket URL for our Node.js server
// Using the same URL as in deepgram.ts
const SERVER_URL = "ws://172.16.1.123:3002";

// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
	const bytes = new Uint8Array(buffer);
	const binary = String.fromCharCode(...bytes);
	return global.btoa(binary);
};

const useDeepgramAgent = ({
	onBeforeStarting,
	onStarted,
	onAfterStarted,
	onEnd,
	onError,
	onMessage,
}: UseAgentProps): {
	startSession: () => void;
	stopSession: () => void;
} => {
	// References
	const ws = useRef<WebSocket | null>(null);
	const recording = useRef<Audio.Recording | null>(null);
	const keepAliveInterval = useRef<NodeJS.Timeout | null>(null);
	const conversationContext = useRef<
		| {
				role: "user" | "assistant";
				content: string;
		  }[]
		| null
	>(null);
	const instructions = useRef<string | null>(null);

	// For simulation mode - predefined conversation
	const simulatedConversation = [
		{
			role: "assistant",
			content: "Hello! How are you feeling today?",
			delay: 1000,
		},
		{
			role: "user",
			content: "I'm actually feeling quite stressed today.",
			delay: 3000,
		},
		{
			role: "assistant",
			content:
				"I'm sorry to hear that you're feeling stressed. Would you like to tell me more about what's causing your stress?",
			delay: 2000,
		},
		{
			role: "user",
			content: "I have a lot of deadlines and not enough time.",
			delay: 4000,
		},
		{
			role: "assistant",
			content:
				"That sounds really overwhelming. Having too many things to do in too little time can definitely cause a lot of stress. Have you tried prioritizing your tasks or breaking them down into smaller steps?",
			delay: 2500,
		},
	];

	// For demo - simulate conversation
	let simulationInterval: NodeJS.Timeout | null = null;
	let currentMessageIndex = 0;

	// Start a recording session
	const startSession = async () => {
		try {
			onBeforeStarting();

			// Request microphone permission
			const { granted } = await Audio.requestPermissionsAsync();
			if (!granted) {
				throw new Error("Permission to use microphone was denied");
			}

			console.log("Agent starting...");

			// Create the Voice Agent Controller
			const vac: VoiceAgentController = {
				// Set initial instructions for the agent
				sendInitialInstructions: (initialInstructions: string) => {
					instructions.current = initialInstructions;
					return Promise.resolve();
				},

				// Set initial conversation context
				setInitialConversationPhrases: (
					phrases: {
						role: "user" | "assistant";
						text: string;
					}[]
				) => {
					conversationContext.current = phrases.map((phrase) => ({
						role: phrase.role,
						content: phrase.text,
					}));
					return Promise.resolve();
				},

				// Make the agent say something
				makeAgentSay: (text: string, instructions?: string) => {
					// We could implement this to force the agent to say something
					// For now, we'll just resolve
					return Promise.resolve();
				},

				// Start the agent conversation
				startConversation: () => {
					console.log(
						"Starting real conversation with Deepgram via WebSocket server"
					);

					// Send a welcome message from the assistant
					onMessage({
						role: "assistant",
						content: "Hello! How are you feeling today?",
						timestamp: Date.now(),
					});

					// Connect to our WebSocket server
					try {
						console.log("Connecting to WebSocket server at:", SERVER_URL);
						ws.current = new WebSocket(SERVER_URL);

						console.log("Connection created");

						// WebSocket event handlers
						ws.current.onopen = () => {
							console.log("WebSocket connection opened");
							// Start recording immediately
							startRecording();
						};

						ws.current.onmessage = (event) => {
							console.log(
								"Received message from WebSocket server:",
								event.data
							);

							if (typeof event.data === "string") {
								try {
									const data = JSON.parse(event.data);

									// Process transcription data from Deepgram via our server
									// Handle both direct Deepgram format and our server's format
									let transcript = "";
									let isFinal = false;

									// Check for different response formats
									if (data.transcript) {
										// New Deepgram format
										transcript =
											data.transcript.channel?.alternatives[0]
												?.transcript || "";
										isFinal = !!data.transcript.speech_final;
									} else if (data.channel) {
										// Legacy format
										transcript =
											data.channel.alternatives[0]?.transcript || "";
										isFinal = !!data.is_final;
									}

									if (transcript.trim()) {
										console.log(
											`Transcription ${
												isFinal ? "final" : "interim"
											}:`,
											transcript
										);

										// Send the transcription as a user message
										onMessage({
											role: "user",
											content: transcript,
											timestamp: Date.now(),
										});

										// If it's a final transcription, simulate an assistant response
										if (isFinal) {
											// Wait a moment before responding
											setTimeout(() => {
												onMessage({
													role: "assistant",
													content:
														"I hear you. Can you tell me more about how you're feeling?",
													timestamp: Date.now(),
												});
											}, 1000);
										}
									}
								} catch (parseError) {
									console.error(
										"Error parsing WebSocket message:",
										parseError
									);
								}
							}
						};

						ws.current.onclose = () => {
							console.log("WebSocket closed");
						};

						ws.current.onerror = (err) => {
							console.error("WebSocket error:", err);
							// Continue with simulation mode
						};

						// Set up keep-alive interval
						keepAliveInterval.current = setInterval(() => {
							if (ws.current?.readyState === WebSocket.OPEN) {
								console.log("Keep alive!");
								ws.current?.send(JSON.stringify({ type: "KeepAlive" }));
							}
						}, 5000);
					} catch (error) {
						console.error("Error setting up WebSocket:", error);
						// Continue with simulation mode
					}

					return Promise.resolve();
				},
			};

			// Notify that the agent is started
			onStarted(vac);
		} catch (err) {
			console.error("Error starting session:", err);
			onError(err);
		} finally {
			onAfterStarted();
		}
	};

	// Start recording audio and send chunks to the WebSocket
	const startRecording = async () => {
		try {
			const recordingOptions = {
				android: {
					extension: ".wav",
					outputFormat:
						Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
					audioEncoder:
						Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
					sampleRate: 16000,
					numberOfChannels: 1,
					bitRate: 256000,
				},
				ios: {
					extension: ".wav",
					outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
					audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
					sampleRate: 16000,
					numberOfChannels: 1,
					bitRate: 256000,
					linearPCMBitDepth: 16,
					linearPCMIsBigEndian: false,
					linearPCMIsFloat: false,
				},
				web: {
					mimeType: "audio/webm",
					bitsPerSecond: 256000,
				},
			};

			// Set up recorder
			recording.current = new Audio.Recording();
			await recording.current.prepareToRecordAsync(recordingOptions);

			// Add recording status update callback
			recording.current.setOnRecordingStatusUpdate(async (status) => {
				if (
					status.isRecording &&
					ws.current?.readyState === WebSocket.OPEN
				) {
					// Send audio chunks
					try {
						if (recording.current) {
							const uri = recording.current.getURI();
							if (uri) {
								// Get audio data from the recording
								try {
									// Read the file info
									const fileInfo = await FileSystem.getInfoAsync(uri);

									if (fileInfo.exists) {
										// Read the file as base64
										const base64Data =
											await FileSystem.readAsStringAsync(uri, {
												encoding: FileSystem.EncodingType.Base64,
											});

										// Convert base64 to binary data
										const binaryString = base64.decode(base64Data);

										// Convert binary string to Uint8Array
										const bytes = new Uint8Array(binaryString.length);
										for (let i = 0; i < binaryString.length; i++) {
											bytes[i] = binaryString.charCodeAt(i);
										}

										// Send the audio data to the WebSocket server
										if (ws.current?.readyState === WebSocket.OPEN) {
											ws.current.send(bytes);
											console.log(
												"Sent audio chunk to server, size:",
												bytes.length
											);
										}
									}
								} catch (error) {
									console.error("Error processing audio data:", error);
								}
							}
						}
					} catch (error) {
						console.error("Error processing audio chunk:", error);
					}
				}
			});

			// Start recording
			await recording.current.startAsync();
			console.log("Recording started");
		} catch (error) {
			console.error("Error starting recording:", error);
		}
	};

	// Play audio received from the agent
	const playAudio = async (base64Audio: string) => {
		try {
			// Convert base64 to uri
			const uri = `data:audio/wav;base64,${base64Audio}`;

			// Load the sound
			const { sound } = await Audio.Sound.createAsync({ uri });

			// Play it
			await sound.playAsync();

			// Clean up when done
			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.didJustFinish) {
					sound.unloadAsync();
				}
			});
		} catch (error) {
			console.error("Error playing audio:", error);
		}
	};

	// Stop the recording session
	const stopSession = async () => {
		try {
			// Clear simulation interval if running
			if (simulationInterval) {
				clearInterval(simulationInterval);
				simulationInterval = null;
			}

			// Stop recording
			if (recording.current) {
				await recording.current.stopAndUnloadAsync();
				recording.current = null;
			}

			// Clear keep-alive interval
			if (keepAliveInterval.current) {
				clearInterval(keepAliveInterval.current);
				keepAliveInterval.current = null;
			}

			// Close WebSocket
			if (ws.current) {
				ws.current.close(1000, "Session ended");
				ws.current = null;
			}

			onEnd();
		} catch (err: any) {
			console.error("Error stopping session:", err);
			onError(err?.message || "Error stopping session");
		}
	};

	// Clean up when component unmounts
	useEffect(() => {
		return () => {
			stopSession();
		};
	}, []);

	return {
		startSession,
		stopSession,
	};
};

export default useDeepgramAgent;
