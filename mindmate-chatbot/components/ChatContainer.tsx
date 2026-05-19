'use client';

import React, { useEffect, useRef } from 'react';
import { ChatContainerProps } from '@/types';
import StartingChips from './StartingChips';
import Message from './Message';
import InputBar from './InputBar';
import VoiceInputGuide from './VoiceInputGuide';
import TypingIndicator from './TypingIndicator';

const DEFAULT_CHIPS = [
  "I'm feeling anxious",
  "I need to vent",
  "Help me sleep"
];

export default function ChatContainer({ messages, onSendMessage, isLoading = false }: ChatContainerProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [showVoiceGuide, setShowVoiceGuide] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if user has seen voice guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('mindmate-voice-guide-seen');
    if (!hasSeenGuide) {
      // Show guide after a short delay
      const timer = setTimeout(() => {
        setShowVoiceGuide(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  const handleChipClick = (text: string) => {
    setInputValue(text);
    // Auto-submit after clicking chip
    setTimeout(() => {
      if (text.trim()) {
        onSendMessage(text.trim());
        setInputValue('');
      }
    }, 100);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCloseVoiceGuide = () => {
    setShowVoiceGuide(false);
    localStorage.setItem('mindmate-voice-guide-seen', 'true');
  };

  return (
    <main className="flex-1 flex flex-col bg-[#F5F5F5] dark:bg-[#2a2a2a] h-full relative">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-full">
              <StartingChips chips={DEFAULT_CHIPS} onChipClick={handleChipClick} />
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <TypingIndicator isVisible={isLoading} />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525] px-4 md:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <InputBar
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Share what's on your mind..."
          />
        </div>
      </div>

      {/* Voice Input Guide */}
      {showVoiceGuide && <VoiceInputGuide onClose={handleCloseVoiceGuide} />}
    </main>
  );
}
