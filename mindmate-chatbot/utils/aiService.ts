// AI Service for calling the chat API
// 
// Three-tier response system:
// 1. Crisis Detection (HIGHEST PRIORITY) - Runs before AI call
// 2. AI Response - Calls OpenAI/Gemini API with conversation context
// 3. Rule-based Fallback - Used when AI fails or is unavailable
//
import { Message } from '@/types';

export interface AIResponse {
  message: string;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'crisis';
  source?: 'ai' | 'crisis-protocol' | 'fallback' | 'rate-limit';
}

// Retry configuration
const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function for exponential backoff delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simple client-side rate limiter
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number = 10; // Max requests
  private readonly timeWindow: number = 60000; // Per minute

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequests) {
      return 0;
    }
    const oldestRequest = this.requests[0];
    const timeUntilExpiry = this.timeWindow - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilExpiry);
  }
}

const rateLimiter = new RateLimiter();

export async function getAIResponse(
  userMessage: string,
  conversationHistory: Message[]
): Promise<AIResponse> {
  // Check rate limit
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = Math.ceil(rateLimiter.getTimeUntilNextRequest() / 1000);
    console.warn(`Rate limit reached. Please wait ${waitTime} seconds.`);
    
    // Return a polite rate limit message
    return {
      message: `I'm processing a lot of requests right now. Please wait a moment (about ${waitTime} seconds) before sending another message.`,
      topics: [],
      sentiment: 'neutral',
      source: 'rate-limit',
    };
  }

  // PRIORITY 1: Enhanced crisis detection with emergency alerts
  const { detectCrisis, getEmergencyResponse, sendEmergencyAlert, autoDialEmergencyContact } = require('./crisisDetection');
  const crisisAlert = detectCrisis(userMessage);
  
  if (crisisAlert) {
    console.log(`🚨 CRISIS DETECTED - Severity: ${crisisAlert.severity}`);
    
    // Get emergency contacts from localStorage
    const savedContacts = localStorage.getItem('mindmate-emergency-contacts');
    let emergencyContacts = [];
    
    if (savedContacts) {
      try {
        emergencyContacts = JSON.parse(savedContacts);
      } catch (error) {
        console.error('Error loading emergency contacts:', error);
      }
    }
    
    // Send emergency alerts for critical and high severity
    if (crisisAlert.shouldContactEmergency && emergencyContacts.length > 0) {
      try {
        await sendEmergencyAlert(crisisAlert, userMessage, emergencyContacts);
        console.log('✅ Emergency alerts sent successfully');
      } catch (error) {
        console.error('❌ Failed to send emergency alerts:', error);
      }
    }
    
    // Auto-dial for critical situations
    if (crisisAlert.severity === 'critical' && emergencyContacts.length > 0) {
      // Small delay to let user see the response first
      setTimeout(() => {
        autoDialEmergencyContact(emergencyContacts);
      }, 3000);
    }
    
    // Return crisis response
    const responseMessage = getEmergencyResponse(crisisAlert);
    
    return {
      message: responseMessage,
      topics: ['crisis', crisisAlert.severity],
      sentiment: 'crisis',
      source: 'crisis-protocol',
    };
  }

  // PRIORITY 2: Check legacy crisis protocols as backup
  const { applyAdvancedProtocols } = require('./advancedBotProtocols');
  const legacyCrisisResponse = applyAdvancedProtocols(userMessage);
  
  if (legacyCrisisResponse) {
    console.log('Legacy crisis detected - using protocol response');
    return {
      message: legacyCrisisResponse.message,
      topics: legacyCrisisResponse.topics || [],
      sentiment: legacyCrisisResponse.sentiment || 'crisis',
      source: 'crisis-protocol',
    };
  }

  // PRIORITY 2: Call AI service with retry logic
  let lastError: any = null;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Add exponential backoff delay for retries
      if (attempt > 0) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Retrying AI request (attempt ${attempt + 1}/${MAX_RETRIES + 1}) after ${delayMs}ms delay`);
        await delay(delayMs);
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(-10), // Last 10 messages for context
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if error is retryable
        const isRetryable = response.status === 429 || // Rate limit
                           response.status === 500 || // Server error
                           response.status === 503;   // Service unavailable
        
        if (!isRetryable || attempt === MAX_RETRIES) {
          throw new Error(errorData.error || 'Failed to get AI response');
        }
        
        // Store error and continue to next retry
        lastError = new Error(errorData.error || 'Failed to get AI response');
        continue;
      }

      const data = await response.json();
      
      // Success! Return the response
      return {
        message: data.message,
        topics: data.topics || [],
        sentiment: data.sentiment || 'neutral',
        source: 'ai',
      };

    } catch (error: any) {
      lastError = error;
      
      // Log specific error types
      if (error.name === 'AbortError') {
        console.error(`Request timed out after 30 seconds (attempt ${attempt + 1})`);
      } else if (error.message?.includes('fetch')) {
        console.error(`Network error - unable to reach AI service (attempt ${attempt + 1})`);
      } else {
        console.error(`AI Service Error (attempt ${attempt + 1}):`, error);
      }
      
      // If this was the last retry, break out of loop
      if (attempt === MAX_RETRIES) {
        break;
      }
    }
  }
  
  // PRIORITY 3: All retries failed - fallback to rule-based responses
  console.error('All AI retry attempts failed, using fallback response');
  const { generateBotResponse } = require('./botResponses');
  const fallbackResponse = generateBotResponse(userMessage);
  
  return {
    message: fallbackResponse.message,
    topics: fallbackResponse.topics || [],
    sentiment: fallbackResponse.sentiment || 'neutral',
    source: 'fallback',
  };
}

// Check if AI is configured
export function isAIConfigured(): boolean {
  // This will be checked on the server side
  return true; // Assume configured, will fallback if not
}
