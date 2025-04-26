import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../lib/groq';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { TextInput, IconButton, Text, Button, Portal, Dialog } from 'react-native-paper';
import { router } from 'expo-router';
import { format } from 'date-fns';
import InputAccessoryBar from '../components/InputAccessoryBar';

const THEME_BLUE = '#4169E1';
const THEME_GREEN = '#2E8B57';

type Message = {
  text: string;
  isAI: boolean;
};

type JournalState = 'writing' | 'processing' | 'reviewing';

export default function TextInputScreen() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [journalState, setJournalState] = useState<JournalState>('writing');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentDate = format(new Date(), 'EEE, MMM dd');

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!text.trim() || journalState !== 'writing') return;

    // Add user's message
    const userMessage = { text: text.trim(), isAI: false };
    setMessages(prev => [...prev, userMessage]);
    setText(''); // Clear input after sending

    // Note: API call is now moved to handleGoDeeper
  };

  const handleGoDeeper = async () => {
    // Only trigger if writing and there are messages
    if (journalState !== 'writing' || messages.length === 0) return;

    // Find the last user message to send to the AI
    const lastUserMessage = messages.slice().reverse().find(m => !m.isAI);
    if (!lastUserMessage) {
      console.error('No user message found to send.');
      return;
    }

    setJournalState('processing');
    setIsLoading(true);

    try {
      const prompt = `As a supportive therapist, please respond to this journal entry: ${lastUserMessage.text}`;
      const response = await getChatResponse(prompt);
      const aiResponse = { 
        text: response, 
        isAI: true 
      };
      setMessages(prev => [...prev, aiResponse]);
      setJournalState('reviewing'); // Move to reviewing state after getting response
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Optionally add an error message to the chat
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process that. Please try again.", isAI: true }]);
      setJournalState('writing'); // Revert to writing on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishEntry = () => {
    if (journalState !== 'reviewing') return;
    setShowFinishDialog(true);
  };

  const handleConfirmFinish = () => {
    setShowFinishDialog(false);
    // Reset state for a potential new entry (or navigate away)
    // For now, let's navigate back to landing
    router.push('/');
  };

  const canGoDeeper = journalState === 'writing' && messages.length > 0 && messages[messages.length - 1].isAI === false;
  const canFinishEntry = journalState === 'reviewing';
  const showInputAccessory = canGoDeeper || canFinishEntry || isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.appNameContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text variant="titleMedium" style={styles.appName}>Moodbooster</Text>
          <IconButton icon="chevron-down" size={24} onPress={() => {}} iconColor="#666" />
        </View>
        <IconButton 
          icon="notebook-outline" 
          size={24} 
          onPress={() => {}}
          iconColor="#666"
        />
      </View>

      <View style={styles.dateContainer}>
        <Text variant="bodyLarge" style={styles.dateText}>{currentDate.toUpperCase()}</Text>
        <IconButton icon="cog" size={20} onPress={() => {}} iconColor="#666" />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} 
      >
        <ScrollView 
          style={styles.scrollView}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.title}>What's on your mind?</Text>
          
          {messages.map((message, index) => (
            <Text
              key={index}
              style={[styles.message, message.isAI ? styles.aiMessage : styles.userMessage]}
            >
              {message.text}
            </Text>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME_BLUE} />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputAreaContainer}>
          {showInputAccessory && (
            <InputAccessoryBar 
              onGoDeeper={handleGoDeeper} 
              onFinishEntry={handleFinishEntry}
              goDeeperDisabled={!canGoDeeper || isLoading} // Disable Go Deeper if not applicable or loading
              finishEntryDisabled={!canFinishEntry || isLoading} // Disable Finish Entry if not applicable or loading
            />
          )}
          <View style={styles.textInputWrapper}>
            <TextInput
              mode="flat"
              multiline
              placeholder={journalState === 'writing' ? "Write your thoughts..." : "Reviewing feedback..."}
              contentStyle={{
                fontSize: 18,
                paddingVertical: 8,
                paddingHorizontal: 0
              }}
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSendMessage} // Keep submit for quick adds in 'writing' state
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor="#000"
              editable={journalState === 'writing'} // Only editable when writing
              right={text.trim() && journalState === 'writing' ? <TextInput.Icon icon="send" onPress={handleSendMessage} /> : null}
            />
          </View>
        </View>

      </KeyboardAvoidingView>

      <Portal>
        <Dialog visible={showFinishDialog} onDismiss={() => setShowFinishDialog(false)}>
          <Dialog.Title>Finish entry?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={() => setShowFinishDialog(false)}>Back</Button>
            <Button onPress={handleConfirmFinish} textColor={THEME_GREEN}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appName: {
    color: '#000',
    marginRight: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  dateText: {
    color: '#666',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: THEME_BLUE,
    marginTop: 16,
    marginBottom: 16,
  },
  inputAreaContainer: {
  },
  textInputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 18,
  },
  message: {
    fontSize: 16,
    marginVertical: 8,
    lineHeight: 24,
  },
  userMessage: {
    color: '#000',
  },
  aiMessage: {
    color: THEME_BLUE,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
