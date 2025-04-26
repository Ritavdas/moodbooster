# Full App Flow

## 1. Landing Screen (index.tsx)
- **Background**: Calm, neutral animated background (light waves or sunrise)
- **Title**: "What's on your mind?"
- **Two Big Buttons**:
  - ✏️ Write to AI — Opens Text Input Screen
  - 🎤 Talk to AI — Opens Voice Recording Screen

## 2. Text Flow (text.tsx)
- **Background**: Same calm animation
- **Text Input Field**:
  - Placeholder: "Write what's on your mind..."
- **After Submit**:
  - Sends text to GPT-4o
  - **Receives**:
    - Empathetic reflection
    - Open-ended follow-up question
  - **Display**: AI therapist message appears in a chat-style bubble or soft card

## 3. Voice Flow (record.tsx)
- **Background**: Calm background continues
- **Mic Animation**: Pulsing mic icon while recording
- **Recording**:
  - Deepgram API captures and transcribes user's voice
- **After Stop**:
  - Transcript sent to GPT-4o
  - **Receives**:
    - Empathetic reflection
    - Open-ended follow-up question
  - **Display**: AI response same as text flow

## 4. Response Screen (response.tsx)
- **Content**:
  - Display the AI's reply: gentle, non-judgmental response + question
- **Two buttons**:
  - Reply Again (continue talking or typing)
  - End Session (return to landing)
- _(Optional)_ Save Conversation Locally (using AsyncStorage)

## 📊 Tech Stack and Components

### Tech
- React Native + TypeScript + Expo Router
- NativeWind + React Native Paper - UI Components
- Deepgram API (Voice to Text)
- GPT-4o API (Therapist Sentiment Analysis and Responses)
- Lottie Animations (background animations)
- AsyncStorage (optional for saving sessions)

### 🔩 Key Components
- `AnimatedBackground.tsx`: Manages calm visual theme
- `TextInputScreen.tsx`: Text input UI and submission logic
- `VoiceRecordingScreen.tsx`: Mic animation + voice capture
- `ResponseCard.tsx`: Displays AI response + next steps
- `lib/deepgram.ts`: Recording/transcription functions
- `lib/gpt.ts`: API calls to GPT-4o
- `constants/colors.ts`: Mood-mapped color themes

