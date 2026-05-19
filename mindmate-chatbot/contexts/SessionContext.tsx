'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session, Message, ConversationContext } from '@/types';
import { CrisisDetectionResult } from '@/utils/crisisDetection';

interface SessionContextType {
  session: Session | null;
  sessions: Session[];
  crisisModalVisible: boolean;
  currentCrisisData: CrisisDetectionResult | null;
  createNewSession: () => void;
  addMessage: (text: string, sender: 'user' | 'bot') => void;
  updateContext: (context: Partial<ConversationContext>) => void;
  switchSession: (sessionId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  showCrisisModal: (crisisData: CrisisDetectionResult) => void;
  hideCrisisModal: () => void;
  handleEmergencyCall: () => Promise<void>;
  handleEmergencySMS: () => Promise<void>;
  handleEmergencyEmail: () => Promise<void>;
  handleAutoEmail: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Helper function to get user location
async function getUserLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.warn('Location access denied or failed:', error);
        resolve(null);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  });
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [crisisModalVisible, setCrisisModalVisible] = useState(false);
  const [currentCrisisData, setCurrentCrisisData] = useState<CrisisDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewSession = useCallback(() => {
    const newSession: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      messages: [],
      context: {
        topics: [],
        sentiment: 'neutral',
        recommendedResources: [],
      },
    };
    
    // Add to sessions list if current session has messages
    if (session && session.messages.length > 0) {
      setSessions((prev) => [session, ...prev].slice(0, 10)); // Keep last 10 sessions
    }
    
    setSession(newSession);
  }, [session]);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setSession((prev) => {
      if (!prev) return prev;
      
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        sender,
        timestamp: new Date(),
      };

      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });
  }, []);

  const updateContext = useCallback((contextUpdate: Partial<ConversationContext>) => {
    setSession((prev) => {
      if (!prev) return prev;
      
      return {
        ...prev,
        context: {
          ...prev.context,
          ...contextUpdate,
        },
      };
    });
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    const foundSession = sessions.find((s) => s.id === sessionId);
    if (foundSession) {
      // Save current session if it has messages
      if (session && session.messages.length > 0) {
        setSessions((prev) => [session, ...prev.filter((s) => s.id !== session.id)].slice(0, 10));
      }
      setSession(foundSession);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  }, [session, sessions]);

  const sendMessage = useCallback(async (message: string) => {
    if (!session || isLoading) return;

    setIsLoading(true);
    
    // Add user message immediately
    addMessage(message, 'user');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: session.messages,
          sessionId: session.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        addMessage(data.fallback || "I'm here to listen. Can you tell me more?", 'bot');
      } else {
        addMessage(data.message, 'bot');
        
        // Update context with topics and sentiment
        if (data.topics || data.sentiment) {
          updateContext({
            topics: data.topics || [],
            sentiment: data.sentiment || 'neutral',
          });
        }

        // Handle crisis detection
        if (data.crisisDetection && data.crisisDetection.isCrisis) {
          showCrisisModal(data.crisisDetection);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage("I'm having trouble connecting right now. Please try again.", 'bot');
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading, addMessage, updateContext]);

  const showCrisisModal = useCallback((crisisData: CrisisDetectionResult) => {
    setCurrentCrisisData(crisisData);
    setCrisisModalVisible(true);
  }, []);

  const hideCrisisModal = useCallback(() => {
    setCrisisModalVisible(false);
    setCurrentCrisisData(null);
  }, []);

  const handleEmergencyCall = useCallback(async () => {
    if (!session || !currentCrisisData) return;

    try {
      // Get user location directly
      const location = await getUserLocation();
      
      const response = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'call',
          contactIds: ['crisis_hotline'], // Call crisis hotline first
          crisisData: {
            severity: currentCrisisData.severity,
            detectedKeywords: currentCrisisData.detectedKeywords,
            timestamp: new Date().toISOString(),
            userLocation: location,
          },
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      console.log('Emergency call initiated:', result);
      
      // Keep modal open for other actions
    } catch (error) {
      console.error('Error initiating emergency call:', error);
    }
  }, [session, currentCrisisData]);

  const handleEmergencySMS = useCallback(async () => {
    if (!session || !currentCrisisData) return;

    try {
      const location = await getUserLocation();
      
      const response = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sms',
          contactIds: [], // Send to all contacts
          crisisData: {
            severity: currentCrisisData.severity,
            detectedKeywords: currentCrisisData.detectedKeywords,
            timestamp: new Date().toISOString(),
            userLocation: location,
          },
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      console.log('Emergency SMS sent:', result);
      
      // Show success message
      addMessage(`Emergency SMS sent to ${result.contactsReached?.length || 0} contacts.`, 'bot');
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      addMessage('Failed to send emergency SMS. Please try calling directly.', 'bot');
    }
  }, [session, currentCrisisData, addMessage]);

  const handleEmergencyEmail = useCallback(async () => {
    if (!session || !currentCrisisData) return;

    try {
      const location = await getUserLocation();
      
      const response = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'email',
          contactIds: [], // Send to all contacts
          crisisData: {
            severity: currentCrisisData.severity,
            detectedKeywords: currentCrisisData.detectedKeywords,
            timestamp: new Date().toISOString(),
            conversationContext: session.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n'),
            userLocation: location,
          },
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      console.log('Emergency email sent:', result);
      
      // Show success message
      addMessage(`Emergency email sent to ${result.contactsReached?.length || 0} contacts.`, 'bot');
    } catch (error) {
      console.error('Error sending emergency email:', error);
      addMessage('Failed to send emergency email. Please try other contact methods.', 'bot');
    }
  }, [session, currentCrisisData, addMessage]);

  const handleAutoEmail = useCallback(async () => {
    if (!session || !currentCrisisData) return;

    try {
      const location = await getUserLocation();
      
      const response = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'auto-email',
          contactIds: [], // Send to all contacts
          crisisData: {
            severity: currentCrisisData.severity,
            detectedKeywords: currentCrisisData.detectedKeywords,
            timestamp: new Date().toISOString(),
            conversationContext: session.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n'),
            userLocation: location,
          },
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      console.log('Auto emergency email sent:', result);
      
      // Show success message
      addMessage(`Automatic emergency alert sent to ${result.contactsReached?.length || 0} contacts.`, 'bot');
    } catch (error) {
      console.error('Error sending auto emergency email:', error);
      addMessage('Failed to send automatic emergency alert.', 'bot');
    }
  }, [session, currentCrisisData, addMessage]);

  return (
    <SessionContext.Provider value={{ 
      session, 
      sessions, 
      crisisModalVisible,
      currentCrisisData,
      createNewSession, 
      addMessage, 
      updateContext, 
      switchSession,
      sendMessage,
      showCrisisModal,
      hideCrisisModal,
      handleEmergencyCall,
      handleEmergencySMS,
      handleEmergencyEmail,
      handleAutoEmail
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
