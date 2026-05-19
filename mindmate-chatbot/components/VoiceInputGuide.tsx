'use client';

import React from 'react';
import { Mic, X } from 'lucide-react';

interface VoiceInputGuideProps {
  onClose: () => void;
}

export default function VoiceInputGuide({ onClose }: VoiceInputGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-[#6B6B6B]" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#B4D4E1]/20 flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-[#B4D4E1]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#4A4A4A] text-center mb-2">
          Voice Input
        </h2>

        {/* Description */}
        <p className="text-[#6B6B6B] text-center mb-6">
          Speak naturally and your words will be converted to text
        </p>

        {/* Instructions */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B4D4E1] text-white flex items-center justify-center flex-shrink-0 font-semibold">
              1
            </div>
            <div>
              <h3 className="font-medium text-[#4A4A4A] mb-1">Click the microphone</h3>
              <p className="text-sm text-[#6B6B6B]">
                Tap the microphone button in the input bar to start recording
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B4D4E1] text-white flex items-center justify-center flex-shrink-0 font-semibold">
              2
            </div>
            <div>
              <h3 className="font-medium text-[#4A4A4A] mb-1">Speak clearly</h3>
              <p className="text-sm text-[#6B6B6B]">
                Share what's on your mind in a clear, natural voice
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B4D4E1] text-white flex items-center justify-center flex-shrink-0 font-semibold">
              3
            </div>
            <div>
              <h3 className="font-medium text-[#4A4A4A] mb-1">Stop when done</h3>
              <p className="text-sm text-[#6B6B6B]">
                Click the microphone again to stop, or it will stop automatically after a pause
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#E8DCC4]/20 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-[#4A4A4A] mb-2 text-sm">💡 Tips</h3>
          <ul className="text-xs text-[#6B6B6B] space-y-1">
            <li>• Find a quiet space for better accuracy</li>
            <li>• Allow microphone access when prompted</li>
            <li>• You can edit the text before sending</li>
            <li>• Works best in Chrome, Edge, and Safari</li>
          </ul>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="
            w-full py-3 rounded-2xl
            bg-[#B4D4E1] hover:bg-[#A0C4D1]
            text-[#4A4A4A] font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
          "
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
