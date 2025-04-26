import { Audio } from 'expo-av';
import { createClient } from '@deepgram/sdk';
import * as FileSystem from 'expo-file-system';

// Initialize Deepgram with your API key
// In a real app, this would be stored securely in environment variables
const DEEPGRAM_API_KEY = 'YOUR_DEEPGRAM_API_KEY';
const deepgram = createClient(DEEPGRAM_API_KEY);

// Configure audio recording settings
const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

// Class to handle voice recording and transcription
export class VoiceRecorder {
  private recording: Audio.Recording | null = null;
  private recordingUri: string | null = null;

  // Start recording audio
  async startRecording(): Promise<void> {
    try {
      // Request permission to record audio
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Permission to access microphone was denied');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Create and start the recording
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      this.recording = recording;
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error);
      throw error;
    }
  }

  // Stop recording and return the audio file URI
  async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      // Stop the recording
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recordingUri = uri;
      this.recording = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      console.log('Recording stopped and stored at', uri);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording', error);
      throw error;
    }
  }

  // Transcribe the recorded audio using Deepgram
  async transcribeAudio(): Promise<string> {
    if (!this.recordingUri) {
      throw new Error('No recording available to transcribe');
    }

    try {
      // Read the audio file as base64
      const base64Audio = await FileSystem.readAsStringAsync(this.recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to buffer for Deepgram
      const audioBuffer = Buffer.from(base64Audio, 'base64');

      // Send to Deepgram for transcription using v3 API
      const { result } = await deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: 'nova-2',
          smart_format: true,
          mimetype: 'audio/m4a'
        }
      );

      // Extract the transcription text (v3 API response format)
      const transcript = result.channels[0]?.alternatives[0]?.transcript || '';
      console.log('Transcription:', transcript);
      return transcript;
    } catch (error) {
      console.error('Failed to transcribe audio', error);
      throw error;
    }
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    if (this.recordingUri) {
      try {
        await FileSystem.deleteAsync(this.recordingUri);
        this.recordingUri = null;
        console.log('Recording file deleted');
      } catch (error) {
        console.error('Failed to delete recording file', error);
      }
    }
  }

  // For demo purposes, return a mock transcription
  async getMockTranscription(): Promise<string> {
    // Simulate a delay for the transcription process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a random mock transcription
    const mockTranscriptions = [
      "I'm feeling really happy today. Everything seems to be going well.",
      "I'm feeling a bit down today. Nothing seems to be working out.",
      "I'm so frustrated and angry right now. I can't believe this happened again.",
      "I'm just feeling okay, nothing special. Just a normal day.",
      "I'm feeling anxious about my upcoming presentation. I hope it goes well."
    ];
    
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }
}
