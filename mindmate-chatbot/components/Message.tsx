'use client';

import React from 'react';
import { MessageProps } from '@/types';

export default function Message({ message }: MessageProps) {
  const isUser = message.sender === 'user';
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
    
    // Just now (less than 60 seconds)
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Minutes ago (less than 60 minutes)
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    
    // Today - show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Older - show date
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
      role="article"
      aria-label={`${isUser ? 'Your' : 'MindMate'} message`}
    >
      <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-[#B4D4E1] dark:bg-[#5a8a9a] text-[#4A4A4A] dark:text-[#e5e5e5] rounded-tr-sm' 
              : 'bg-[#D4E8D4] dark:bg-[#6a8a6a] text-[#4A4A4A] dark:text-[#e5e5e5] rounded-tl-sm'
            }
          `}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] mt-1 px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
