'use client';

import React from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
}

export default function VoiceVisualizer({ isActive }: VoiceVisualizerProps) {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-[#F4A5A5] rounded-full animate-voice-wave"
          style={{
            animationDelay: `${i * 0.1}s`,
            height: '100%',
          }}
        />
      ))}
    </div>
  );
}
