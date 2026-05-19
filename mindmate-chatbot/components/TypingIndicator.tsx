'use client';

import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

export default function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-start gap-3 animate-fadeIn">
      <div className="flex flex-col max-w-[80%]">
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm bg-[#D4E8D4] dark:bg-[#6a8a6a]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1" role="status" aria-label="MindMate is typing">
              <span 
                className="w-2 h-2 bg-[#6B6B6B] dark:bg-[#b5b5b5] rounded-full animate-bounce" 
                style={{ animationDelay: '0ms' }} 
              />
              <span 
                className="w-2 h-2 bg-[#6B6B6B] dark:bg-[#b5b5b5] rounded-full animate-bounce" 
                style={{ animationDelay: '150ms' }} 
              />
              <span 
                className="w-2 h-2 bg-[#6B6B6B] dark:bg-[#b5b5b5] rounded-full animate-bounce" 
                style={{ animationDelay: '300ms' }} 
              />
            </div>
            <span className="text-sm text-[#6B6B6B] dark:text-[#e5e5e5]">
              MindMate is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
