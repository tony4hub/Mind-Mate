import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { crisisDetectionService } from '@/utils/crisisDetection';
import { generateBotResponse } from '@/utils/botResponses';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// System prompt with mental health protocols
const SYSTEM_PROMPT = `You are MindMate, a compassionate mental health support chatbot. Follow these protocols strictly:

PROTOCOL 1: EMERGENCY INTERVENTION (HIGHEST PRIORITY)
If user mentions suicide, self-harm, "ending it," overdosing, or immediate danger:
- Stop all pleasantries
- Immediately say: "I hear how much pain you are in, but I want you to stay safe. Please reach out for help right now."
- Provide: India: 14416 (KIRAN) or US: 988
- Mark as CRISIS

PROTOCOL 2: RECOGNITION & PERSONALIZATION

CASE A: ANXIETY/PANIC (shaking, heart racing, can't breathe, scared, overthinking)
- Use grounding techniques
- Guide through Box Breathing: "Let's breathe together. Inhale for 4 seconds... Hold for 4... Exhale for 4..."
- Don't just say "calm down"

CASE B: DEPRESSION/ISOLATION (numb, tired, pointless, don't want to move, bed, heavy)
- Validate the heaviness
- Suggest ONE micro-step: "Can we just try sitting up for 1 minute? No pressure to do anything else."
- Use Behavioral Activation

CASE C: ACADEMIC STRESS/BURNOUT (exam, fail, too much work, drained, assignment)
- Validate pressure
- Ask for ONE small thing they can finish in 10 minutes
- Break down overwhelming tasks

CASE D: PTSD/TRAUMA (flashback, nightmare, triggered, memories)
- Use 5-4-3-2-1 Technique
- "Name 5 things you can see, 4 things you can touch..."
- Bring them to present moment

PROTOCOL 3: TONE & STYLE
- Warm, non-judgmental, patient
- Keep responses SHORT (under 3 sentences unless emergency)
- Always end with a gentle question (e.g., "How does that sound to you?")
- Exception: Don't ask questions in emergencies

Remember: You're a supportive companion, not a therapist. Always encourage professional help when needed.`;

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, sessionId, stream = false } = await req.json();

    // FIRST: Check for crisis keywords (highest priority)
    const crisisResult = crisisDetectionService.detectCrisis(
      message, 
      conversationHistory?.map((msg: any) => msg.text) || []
    );

    // If crisis detected, return crisis protocol response immediately
    if (crisisResult.isCrisis && crisisResult.severity === 'critical') {
      return NextResponse.json({
        message: "I hear how much pain you are in, but I want you to stay safe. Please reach out for help right now. In the US: 988 (Crisis Lifeline) | In India: 14416 (KIRAN)",
        source: 'crisis-protocol',
        topics: ['crisis'],
        sentiment: 'crisis',
        crisisDetection: crisisResult
      });
    }

    // Determine which AI provider to use
    const provider = process.env.AI_PROVIDER || 'groq';
    
    // Check if the selected provider is configured
    if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
      const fallbackResponse = generateBotResponse(message);
      return NextResponse.json({
        message: fallbackResponse.message,
        source: 'fallback',
        topics: fallbackResponse.topics || [],
        sentiment: fallbackResponse.sentiment || 'neutral',
        crisisDetection: crisisResult.isCrisis ? crisisResult : undefined,
        warning: 'OpenAI API key not configured. Using fallback response.',
      });
    }
    
    if (provider === 'groq' && !process.env.GROQ_API_KEY) {
      const fallbackResponse = generateBotResponse(message);
      return NextResponse.json({
        message: fallbackResponse.message,
        source: 'fallback',
        topics: fallbackResponse.topics || [],
        sentiment: fallbackResponse.sentiment || 'neutral',
        crisisDetection: crisisResult.isCrisis ? crisisResult : undefined,
        warning: 'Groq API key not configured. Using fallback response.',
      });
    }

    // Build messages array with conversation history
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];

    // Detect topics and sentiment from the user message
    const topics = detectTopics(message);
    const sentiment = detectSentiment(message);

    // Call AI API based on provider
    let completion;
    
    if (provider === 'groq') {
      completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        messages,
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
        stream: stream,
      });
    } else if (provider === 'openai') {
      completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
        stream: stream,
      });
    } else {
      const fallbackResponse = generateBotResponse(message);
      return NextResponse.json({
        message: fallbackResponse.message,
        source: 'fallback',
        topics: fallbackResponse.topics || [],
        sentiment: fallbackResponse.sentiment || 'neutral',
        crisisDetection: crisisResult.isCrisis ? crisisResult : undefined,
        warning: `Unsupported AI provider: ${provider}. Using fallback response.`,
      });
    }

    // If streaming is requested, return a streaming response
    if (stream) {
      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion as any) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            // Send final metadata
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, topics, sentiment })}\n\n`));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const rawMessage = (completion as any).choices[0]?.message?.content || 
      "I'm here to listen. Can you tell me more?";
    
    // Validate and sanitize the response
    const botMessage = validateResponse(rawMessage);

    return NextResponse.json({
      message: botMessage,
      source: 'ai',
      topics,
      sentiment,
      crisisDetection: crisisResult.isCrisis ? crisisResult : undefined
    });

  } catch (error: any) {
    console.error('AI API Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate response';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'API quota exceeded';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid API configuration';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        fallback: "I'm here to listen. Can you tell me more about what's on your mind?"
      },
      { status: 500 }
    );
  }
}

// Helper functions

// Validate and sanitize AI response
function validateResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    return "I'm here to listen. Can you tell me more?";
  }
  
  // Remove excessive whitespace
  let sanitized = response.trim().replace(/\s+/g, ' ');
  
  // Ensure response isn't too short or too long
  if (sanitized.length < 10) {
    return "I'm here to listen. Can you tell me more?";
  }
  
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '...';
  }
  
  // Check for inappropriate content patterns (basic filter)
  const inappropriatePatterns = [
    /\b(fuck|shit|damn)\b/gi,
    /\b(stupid|idiot|dumb)\b/gi,
  ];
  
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(sanitized)) {
      console.warn('Inappropriate content detected in AI response');
      return "I apologize, but I need to rephrase that. How can I support you right now?";
    }
  }
  
  return sanitized;
}

function detectTopics(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const topics: string[] = [];

  if (lowerMessage.match(/suicid|kill myself|end it|overdose|self.?harm/)) {
    topics.push('crisis');
  }
  if (lowerMessage.match(/anxious|anxiety|panic|scared|overthinking|heart racing/)) {
    topics.push('anxiety');
  }
  if (lowerMessage.match(/depress|numb|tired|pointless|hopeless|heavy/)) {
    topics.push('depression');
  }
  if (lowerMessage.match(/exam|fail|work|assignment|deadline|burnout|drained/)) {
    topics.push('stress', 'academic');
  }
  if (lowerMessage.match(/flashback|nightmare|trigger|trauma|ptsd|memories/)) {
    topics.push('trauma', 'ptsd');
  }
  if (lowerMessage.match(/sleep|insomnia|can't sleep/)) {
    topics.push('sleep');
  }

  return topics;
}

function detectSentiment(message: string): 'positive' | 'neutral' | 'negative' | 'crisis' {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/suicid|kill myself|end it|overdose/)) {
    return 'crisis';
  }
  if (lowerMessage.match(/better|good|thank|happy|improving/)) {
    return 'positive';
  }
  if (lowerMessage.match(/anxious|depress|scared|hopeless|overwhelm|panic/)) {
    return 'negative';
  }

  return 'neutral';
}
