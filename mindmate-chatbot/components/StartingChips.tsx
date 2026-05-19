'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { StartingChipsProps } from '@/types';

export default function StartingChips({ chips, onChipClick }: StartingChipsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 px-4 animate-fadeIn">
      {/* Welcome Icon */}
      <div className="w-16 h-16 rounded-full bg-[#B4D4E1]/20 flex items-center justify-center mb-2">
        <Heart className="w-8 h-8 text-[#B4D4E1]" />
      </div>
      
      {/* Welcome Message */}
      <div className="text-center max-w-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#4A4A4A] mb-3">
          Welcome to MindMate
        </h2>
        <p className="text-base text-[#6B6B6B] leading-relaxed">
          I'm here to listen and support you. Your wellbeing matters, and this is a safe space to share what's on your mind.
        </p>
      </div>

      {/* Starting Chips */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <p className="text-sm text-[#6B6B6B] font-medium">
          How can I support you today?
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-md">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChipClick(chip)}
              className="
                px-6 py-3 rounded-3xl
                bg-white border border-[#B4D4E1]
                text-[#4A4A4A] text-sm font-medium
                shadow-sm hover:shadow-md
                hover:scale-105 hover:border-[#A0C4D1]
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
              "
              aria-label={`Start conversation: ${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Subtle reminder */}
      <p className="text-xs text-[#6B6B6B] text-center max-w-sm mt-6">
        If you're in crisis, please use the emergency resources on the right or call 988
      </p>
    </div>
  );
}
