// Bot response utilities for more empathetic and contextual replies
import { applyAdvancedProtocols } from './advancedBotProtocols';

export interface BotResponse {
  message: string;
  topics?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative' | 'crisis';
}

export function generateBotResponse(userMessage: string): BotResponse {
  // FIRST: Apply advanced mental health protocols (HIGHEST PRIORITY)
  const protocolResponse = applyAdvancedProtocols(userMessage);
  if (protocolResponse) {
    return protocolResponse;
  }

  // FALLBACK: Original response logic
  const lowerMessage = userMessage.toLowerCase();

  // Anxiety responses
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    const responses = [
      "I hear that you're feeling anxious. That must be really difficult. Would you like to try a breathing exercise, or would you prefer to talk about what's making you feel this way?",
      "Anxiety can feel overwhelming. Thank you for sharing that with me. What's been on your mind lately?",
      "It takes courage to acknowledge anxiety. I'm here to listen. Can you tell me more about what you're experiencing?",
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['anxiety'],
      sentiment: 'negative',
    };
  }

  // Sleep issues
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
    const responses = [
      "Sleep difficulties can really affect how we feel. How long have you been having trouble sleeping?",
      "I understand sleep issues can be frustrating. Have you noticed any patterns or things that might be affecting your sleep?",
      "Getting good rest is so important. Let's talk about what might be keeping you awake.",
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['sleep'],
      sentiment: 'negative',
    };
  }

  // Stress/venting
  if (lowerMessage.includes('vent') || lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
    const responses = [
      "I'm here to listen. Sometimes it helps just to get things off your chest. What's been weighing on you?",
      "It sounds like you've been carrying a lot. I'm here for you. Tell me what's going on.",
      "Thank you for trusting me with this. I'm listening. What would you like to share?",
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['stress'],
      sentiment: 'negative',
    };
  }

  // Depression indicators
  if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
    return {
      message: "I'm sorry you're feeling this way. Depression can make everything feel harder. You're not alone in this. Would you like to talk about what you're going through?",
      topics: ['depression'],
      sentiment: 'negative',
    };
  }

  // Positive expressions
  if (lowerMessage.includes('better') || lowerMessage.includes('good') || lowerMessage.includes('thank')) {
    const responses = [
      "I'm glad to hear that. It's wonderful that you're taking steps to care for yourself.",
      "That's great to hear. What's been helping you feel better?",
      "I'm happy things are looking up for you. Keep taking care of yourself.",
    ];
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: [],
      sentiment: 'positive',
    };
  }

  // Default empathetic response
  const defaultResponses = [
    "Thank you for sharing that with me. How are you feeling right now?",
    "I hear you. Can you tell me more about what's on your mind?",
    "I'm here to listen. What would be most helpful for you to talk about?",
    "That sounds important. Would you like to explore that further?",
  ];

  return {
    message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    topics: [],
    sentiment: 'neutral',
  };
}
