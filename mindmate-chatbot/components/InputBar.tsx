'use client';

import React, { useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function InputBar({
  value,
  onChange,
  onSubmit,
  onKeyPress,
  placeholder = 'Type your message...',
  disabled = false,
}: InputBarProps) {
  const isEmptyOrWhitespace = !value.trim();
  const [showVoiceError, setShowVoiceError] = React.useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error: voiceError,
  } = useSpeechRecognition({
    onResult: (text) => {
      // Append the recognized text to the current value
      onChange(value + (value ? ' ' : '') + text);
    },
    onError: (error) => {
      console.error('Voice recognition error:', error);
      setShowVoiceError(true);
      setTimeout(() => setShowVoiceError(false), 3000);
    },
    continuous: false,
  });

  // Update input with interim results while listening
  useEffect(() => {
    if (isListening && interimTranscript) {
      // Show interim transcript as placeholder or hint
    }
  }, [interimTranscript, isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const displayValue = isListening && interimTranscript 
    ? value + (value ? ' ' : '') + interimTranscript 
    : value;

  return (
    <div className="relative">
      {/* Voice error tooltip */}
      {showVoiceError && voiceError && (
        <div className="absolute bottom-full left-0 right-0 mb-2 px-4 py-2 bg-[#F4A5A5] text-white text-sm rounded-lg shadow-lg animate-fadeIn">
          {voiceError}
        </div>
      )}

      <div
        className={`
          flex items-center gap-3
          bg-white rounded-[28px] border-2
          ${isListening ? 'border-[#F4A5A5] shadow-[0_0_0_3px_rgba(244,165,165,0.2)]' : 'border-[#E8DCC4]'}
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
          px-5 py-3
          focus-within:border-[#B4D4E1]
          transition-all duration-200
        `}
      >
        {/* Voice input button */}
        {isSupported && (
          <button
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={`
              p-2 rounded-full
              ${isListening 
                ? 'bg-[#F4A5A5] hover:bg-[#E89595] animate-pulse-slow' 
                : 'bg-[#E8DCC4] hover:bg-[#D8CCA4]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
              flex items-center justify-center
            `}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-[#4A4A4A]" />
            )}
          </button>
        )}

        <input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isListening ? 'Listening...' : placeholder}
          disabled={disabled || isListening}
          className={`
            flex-1 bg-transparent
            text-[#4A4A4A] placeholder:text-[#6B6B6B]
            text-sm md:text-base
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isListening ? 'placeholder:text-[#F4A5A5]' : ''}
          `}
          aria-label="Message input"
        />

        <button
          onClick={onSubmit}
          disabled={disabled || isEmptyOrWhitespace || isListening}
          className="
            p-2 rounded-full
            bg-[#B4D4E1] hover:bg-[#A0C4D1]
            disabled:bg-[#E8DCC4] disabled:cursor-not-allowed
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
            flex items-center justify-center
          "
          aria-label="Send message"
        >
          <Send className="w-5 h-5 text-[#4A4A4A]" />
        </button>
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-[#F4A5A5] font-medium animate-pulse">
            🎤 Listening...
          </span>
        </div>
      )}
    </div>
  );
}
