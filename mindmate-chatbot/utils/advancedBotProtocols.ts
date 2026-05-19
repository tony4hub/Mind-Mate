// Advanced Mental Health Response Protocols
import { BotResponse } from './botResponses';

// PROTOCOL 1: EMERGENCY INTERVENTION
export function detectEmergency(message: string): BotResponse | null {
  const lowerMessage = message.toLowerCase();
  
  const emergencyKeywords = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'ending it',
    'overdose', 'self harm', 'self-harm', 'hurt myself', 'no reason to live',
    'better off dead', 'can\'t go on', 'end my life'
  ];

  const hasEmergency = emergencyKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasEmergency) {
    return {
      message: "I hear how much pain you are in, but I want you to stay safe. Please reach out for help right now.\n\n🆘 Crisis Resources:\n• India: 14416 (KIRAN Mental Health Rehab)\n• US: 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n\nYou don't have to face this alone. These services are free, confidential, and available 24/7.",
      topics: ['crisis'],
      sentiment: 'crisis',
    };
  }

  return null;
}

// PROTOCOL 2: CASE-SPECIFIC RESPONSES

// CASE A: ANXIETY / PANIC
export function handleAnxietyPanic(message: string): BotResponse | null {
  const lowerMessage = message.toLowerCase();
  
  const anxietyKeywords = [
    'shaking', 'heart racing', 'can\'t breathe', 'scared', 'overthinking',
    'panic', 'anxious', 'anxiety', 'worried', 'nervous', 'racing thoughts'
  ];

  const hasAnxiety = anxietyKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasAnxiety) {
    const responses = [
      "I can hear the anxiety in your words. Let's ground you right now with box breathing:\n\n🫁 Breathe IN for 4 seconds...\n⏸️ HOLD for 4 seconds...\n🌬️ Breathe OUT for 4 seconds...\n⏸️ HOLD for 4 seconds...\n\nCan you try this with me?",
      "That sounds really overwhelming. Let's bring you back to the present moment. Can you name 5 things you can see right now?",
      "I hear you. Your body is in fight-or-flight mode. Let's slow it down together. Breathe in for 4... hold for 4... out for 4. How does that feel?",
    ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['anxiety'],
      sentiment: 'negative',
    };
  }

  return null;
}

// CASE B: DEPRESSION / ISOLATION
export function handleDepressionIsolation(message: string): BotResponse | null {
  const lowerMessage = message.toLowerCase();
  
  const depressionKeywords = [
    'numb', 'tired', 'pointless', 'don\'t want to move', 'bed', 'heavy',
    'depressed', 'hopeless', 'empty', 'exhausted', 'can\'t get up', 'no energy'
  ];

  const hasDepression = depressionKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasDepression) {
    const responses = [
      "I hear how heavy everything feels right now. That's real, and it makes sense. Can we try something tiny together? Just sitting up for 1 minute. No pressure to do anything else.",
      "That exhaustion is valid. You don't have to do everything at once. What's one small thing - even just opening a window - that might feel okay right now?",
      "I understand that heaviness. You're not alone in feeling this way. Would it be okay to try one tiny step? Maybe just standing up for 30 seconds?",
    ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['depression'],
      sentiment: 'negative',
    };
  }

  return null;
}

// CASE C: ACADEMIC STRESS / BURNOUT
export function handleAcademicStress(message: string): BotResponse | null {
  const lowerMessage = message.toLowerCase();
  
  const academicKeywords = [
    'exam', 'fail', 'too much work', 'drained', 'assignment',
    'test', 'study', 'homework', 'deadline', 'grades', 'burnout', 'overwhelmed with work'
  ];

  const hasAcademic = academicKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasAcademic) {
    const responses = [
      "That pressure sounds intense. Let's break this down. Can you name just ONE small thing you could finish in the next 10 minutes? Not everything - just one thing.",
      "I hear you. That workload feels crushing. What if we focus on just the next 10 minutes? What's one tiny task you could tackle right now?",
      "Academic stress is real. You don't have to do it all at once. What's the smallest possible step you could take in the next few minutes?",
    ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['stress', 'academic'],
      sentiment: 'negative',
    };
  }

  return null;
}

// CASE D: PTSD / TRAUMA TRIGGER
export function handleTraumaTrigger(message: string): BotResponse | null {
  const lowerMessage = message.toLowerCase();
  
  const traumaKeywords = [
    'flashback', 'nightmare', 'triggered', 'memories', 'trauma',
    'ptsd', 'reliving', 'haunted', 'can\'t forget'
  ];

  const hasTrauma = traumaKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasTrauma) {
    const responses = [
      "I'm here with you. Let's bring you back to the present moment using the 5-4-3-2-1 technique:\n\nName 5 things you can SEE right now.\nCan you do that with me?",
      "You're safe right now. Let's anchor you to the present. Can you name 5 things you can see around you? Take your time.",
      "I hear you. Let's ground you in the here and now. Look around - what are 5 things you can see? This will help bring you back.",
    ];

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      topics: ['trauma', 'ptsd'],
      sentiment: 'negative',
    };
  }

  return null;
}

// PROTOCOL 3: TONE & STYLE
export function formatResponse(response: string): string {
  // Keep responses short and conversational
  // Already handled in the response generation above
  return response;
}

// Main protocol handler
export function applyAdvancedProtocols(message: string): BotResponse | null {
  // PROTOCOL 1: Check for emergency first (highest priority)
  const emergencyResponse = detectEmergency(message);
  if (emergencyResponse) return emergencyResponse;

  // PROTOCOL 2: Check specific cases
  const anxietyResponse = handleAnxietyPanic(message);
  if (anxietyResponse) return anxietyResponse;

  const depressionResponse = handleDepressionIsolation(message);
  if (depressionResponse) return depressionResponse;

  const academicResponse = handleAcademicStress(message);
  if (academicResponse) return academicResponse;

  const traumaResponse = handleTraumaTrigger(message);
  if (traumaResponse) return traumaResponse;

  // No specific protocol matched
  return null;
}
