import axios from 'axios';

// OpenAI API key - in a real app, this would be stored securely in environment variables
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// Define the mood types
export type MoodType = 'happy' | 'sad' | 'angry' | 'neutral' | 'calm';

// Interface for the mood analysis response
export interface MoodAnalysis {
  mood: MoodType;
  message: string;
}

// Function to analyze text and detect mood using GPT-4o
export async function analyzeMood(text: string): Promise<MoodAnalysis> {
  try {
    // API endpoint for GPT-4o
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    // Prepare the prompt for mood analysis
    const prompt = `
      Analyze the following text and determine the emotional state of the person.
      Categorize the mood as one of: happy, sad, angry, neutral, or calm.
      Also provide a short, comforting response that acknowledges their feelings and offers support.
      
      Format your response as a JSON object with two fields:
      1. "mood": The detected mood category (happy, sad, angry, neutral, or calm)
      2. "message": A comforting message (2-3 sentences max)
      
      Text to analyze: "${text}"
    `;
    
    // Make the API request
    const response = await axios.post(
      endpoint,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an empathetic AI assistant that analyzes emotions and provides comfort.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    // Parse the response
    const content = response.data.choices[0].message.content;
    const result = JSON.parse(content);
    
    return {
      mood: result.mood as MoodType,
      message: result.message
    };
  } catch (error) {
    console.error('Error analyzing mood with GPT:', error);
    throw error;
  }
}

// For demo purposes, return mock mood analysis
export function getMockMoodAnalysis(text: string): Promise<MoodAnalysis> {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple keyword-based mood detection for demo
      let mood: MoodType = 'neutral';
      let message = '';
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('good')) {
        mood = 'happy';
        message = "I'm glad you're feeling positive! Your happiness is contagious and brightens the world around you. Keep embracing those good vibes!";
      } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('upset')) {
        mood = 'sad';
        message = "I hear that you're feeling down, and that's completely okay. Remember that all emotions are valid and temporary. Be gentle with yourself today.";
      } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
        mood = 'angry';
        message = "I can sense your frustration. It's natural to feel this way sometimes. Take a deep breath and remember that this feeling will pass with time.";
      } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
        mood = 'calm';
        message = "That sense of calm is wonderful to nurture. You're creating a peaceful space for yourself, which is so important in our busy world.";
      } else {
        message = "Thank you for sharing how you feel. Whatever you're experiencing is valid, and it's okay to sit with these emotions. Take care of yourself today.";
      }
      
      resolve({ mood, message });
    }, 1000);
  });
}
