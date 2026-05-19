'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: Record<Phase, { duration: number; instruction: string; color: string }> = {
  inhale: { duration: 4, instruction: 'Breathe In', color: '#B4D4E1' },
  hold: { duration: 4, instruction: 'Hold', color: '#D4E8D4' },
  exhale: { duration: 4, instruction: 'Breathe Out', color: '#E8DCC4' },
  rest: { duration: 2, instruction: 'Rest', color: '#F5F5F5' },
};

export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState(PHASES.inhale.duration);
  const [cycleCount, setcycleCount] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          // Move to next phase
          const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest'];
          const currentIndex = phases.indexOf(currentPhase);
          const nextPhase = phases[(currentIndex + 1) % phases.length];
          
          if (nextPhase === 'inhale') {
            setcycleCount((c) => c + 1);
          }
          
          setCurrentPhase(nextPhase);
          return PHASES[nextPhase].duration;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentPhase]);

  // Animate circle scale based on phase
  useEffect(() => {
    if (currentPhase === 'inhale') {
      setScale(1.5);
    } else if (currentPhase === 'exhale') {
      setScale(0.7);
    } else {
      setScale(1);
    }
  }, [currentPhase]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(PHASES.inhale.duration);
    setcycleCount(0);
    setScale(1);
  };

  const progress = ((PHASES[currentPhase].duration - timeLeft) / PHASES[currentPhase].duration) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-[#2a2a2a] rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close breathing exercise"
        >
          <X className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5]" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] text-center mb-2">
          Breathing Exercise
        </h2>
        <p className="text-[#6B6B6B] dark:text-[#b5b5b5] text-center mb-8 text-sm">
          Follow the circle and breathe deeply
        </p>

        {/* Breathing Circle */}
        <div className="flex items-center justify-center mb-8 h-64">
          <div className="relative">
            {/* Outer ring (progress) */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={PHASES[currentPhase].color}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-100"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner circle (animated) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `scale(${scale})`,
                transition: `transform ${PHASES[currentPhase].duration}s ease-in-out`,
              }}
            >
              <div
                className="w-32 h-32 rounded-full shadow-lg flex items-center justify-center"
                style={{ backgroundColor: PHASES[currentPhase].color }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {Math.ceil(timeLeft)}
                  </div>
                  <div className="text-sm text-white/90 font-medium">
                    {PHASES[currentPhase].instruction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cycle counter */}
        <div className="text-center mb-6">
          <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
            Cycles completed: <span className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">{cycleCount}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="
                flex items-center gap-2 px-6 py-3 rounded-2xl
                bg-[#B4D4E1] hover:bg-[#A0C4D1]
                text-[#4A4A4A] font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
              "
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="
                flex items-center gap-2 px-6 py-3 rounded-2xl
                bg-[#E8DCC4] hover:bg-[#D8CCA4]
                text-[#4A4A4A] font-medium
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#E8DCC4] focus:ring-offset-2
              "
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="
              flex items-center gap-2 px-6 py-3 rounded-2xl
              bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
              text-[#4A4A4A] dark:text-[#e5e5e5] font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
            "
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-[#E8DCC4]/20 dark:bg-[#8a7a5a]/20 rounded-xl">
          <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] text-center">
            💡 Find a comfortable position and focus on your breath. Let thoughts pass without judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
