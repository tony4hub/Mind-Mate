'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Headphones } from 'lucide-react';
import { MeditationSession } from '@/types';

const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief',
    description: 'Calm your mind and reduce anxiety with gentle breathing techniques',
    duration: 10,
    category: 'anxiety',
    script: [
      "Welcome to this anxiety relief meditation. Find a comfortable position and close your eyes.",
      "Take a deep breath in through your nose for 4 counts... 1, 2, 3, 4.",
      "Hold that breath for 4 counts... 1, 2, 3, 4.",
      "Now exhale slowly through your mouth for 6 counts... 1, 2, 3, 4, 5, 6.",
      "Notice how your body begins to relax with each breath.",
      "If anxious thoughts arise, acknowledge them gently and return to your breath.",
      "Continue this rhythm... breathe in for 4, hold for 4, out for 6.",
      "Feel the tension melting away from your shoulders and jaw.",
      "You are safe in this moment. You are exactly where you need to be.",
      "Take three more deep breaths at your own pace.",
      "When you're ready, gently open your eyes. You've done wonderful work."
    ],
    backgroundSound: 'rain'
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation',
    description: 'Gentle meditation to prepare your mind and body for restful sleep',
    duration: 15,
    category: 'sleep',
    script: [
      "Welcome to this sleep preparation meditation. Lie down comfortably in your bed.",
      "Close your eyes and take a long, slow breath in... and out.",
      "Starting from the top of your head, imagine a warm, golden light.",
      "This light slowly moves down, relaxing your forehead, your eyes, your cheeks.",
      "Feel your jaw soften and your neck release any tension.",
      "The golden light continues down to your shoulders, arms, and hands.",
      "Your chest rises and falls naturally, peacefully.",
      "The light moves through your torso, releasing any stress from the day.",
      "Your hips, legs, and feet become heavy and relaxed.",
      "Your whole body is now surrounded by this peaceful, golden light.",
      "With each breath, you sink deeper into comfort and tranquility.",
      "Let go of today's worries. Tomorrow will take care of itself.",
      "Allow yourself to drift into peaceful, restorative sleep."
    ],
    backgroundSound: 'ocean'
  },
  {
    id: 'focus-clarity',
    title: 'Focus & Clarity',
    description: 'Sharpen your mind and improve concentration for better productivity',
    duration: 8,
    category: 'focus',
    script: [
      "Welcome to this focus and clarity meditation. Sit up straight and alert.",
      "Take three deep breaths to center yourself in this moment.",
      "Imagine your mind as a clear, still lake on a calm morning.",
      "Any distracting thoughts are like ripples on the surface.",
      "Simply observe these ripples without judgment, then let them settle.",
      "Return your attention to the stillness beneath the surface.",
      "This is your natural state of clarity and focus.",
      "Feel your mind becoming sharper and more alert with each breath.",
      "You have the power to direct your attention wherever you choose.",
      "When you open your eyes, carry this clarity with you.",
      "Take one final deep breath and gently return to the present moment."
    ],
    backgroundSound: 'forest'
  },
  {
    id: 'stress-release',
    title: 'Stress Release',
    description: 'Release tension and stress from your body and mind',
    duration: 12,
    category: 'stress',
    script: [
      "Welcome to this stress release meditation. Find a comfortable seated position.",
      "Close your eyes and take a moment to notice where you feel tension in your body.",
      "Take a deep breath in, and as you exhale, let your shoulders drop.",
      "Imagine stress as a dark cloud that you can breathe out with each exhale.",
      "Breathe in fresh, clean energy. Breathe out stress and tension.",
      "Scan your body from head to toe, releasing tension wherever you find it.",
      "Your forehead smooths, your jaw unclenches, your neck lengthens.",
      "Your arms become heavy and relaxed at your sides.",
      "Your chest opens and your breathing becomes natural and easy.",
      "Feel the stress melting away like snow in the warm sun.",
      "You are capable of handling whatever comes your way.",
      "Take three more cleansing breaths and slowly open your eyes."
    ],
    backgroundSound: 'rain'
  }
];

const BACKGROUND_SOUNDS = {
  rain: '🌧️ Rain',
  ocean: '🌊 Ocean',
  forest: '🌲 Forest',
  silence: '🔇 Silence'
};

export default function GuidedMeditation() {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [backgroundSound, setBackgroundSound] = useState<keyof typeof BACKGROUND_SOUNDS>('rain');
  const [isMuted, setIsMuted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedSession && isPlaying) {
      const totalSeconds = selectedSession.duration * 60;
      const stepDuration = totalSeconds / selectedSession.script.length;
      
      setTimeRemaining(totalSeconds);
      
      // Timer for overall session
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Timer for script steps
      stepIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= selectedSession.script.length - 1) {
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration * 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [selectedSession, isPlaying]);

  const handlePlay = (session: MeditationSession) => {
    setSelectedSession(session);
    setIsPlaying(true);
    setCurrentStep(0);
    setBackgroundSound(session.backgroundSound || 'rain');
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setSelectedSession(null);
    setCurrentStep(0);
    setTimeRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakText = (text: string) => {
    if (!isMuted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Speak current step when it changes
  useEffect(() => {
    if (selectedSession && isPlaying && currentStep < selectedSession.script.length) {
      speakText(selectedSession.script[currentStep]);
    }
  }, [currentStep, selectedSession, isPlaying, isMuted]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#D4E8D4] dark:bg-[#6a8a6a] rounded-lg flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
            Guided Meditation
          </h2>
          <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
            Find peace and clarity with guided sessions
          </p>
        </div>
      </div>

      {/* Active Session */}
      {selectedSession && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
              {selectedSession.title}
            </h3>
            <p className="text-[#6B6B6B] dark:text-[#b5b5b5] mb-4">
              {selectedSession.description}
            </p>
            
            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-3xl font-mono text-[#B4D4E1] mb-6">
              <Clock className="w-8 h-8" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Current Script */}
          <div className="bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <p className="text-lg text-center text-[#4A4A4A] dark:text-[#e5e5e5] leading-relaxed">
              {selectedSession.script[currentStep] || "Session complete. Take a moment to notice how you feel."}
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-2">
                <span>Step {currentStep + 1} of {selectedSession.script.length}</span>
                <span>{Math.round(((currentStep + 1) / selectedSession.script.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-[#B4D4E1] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentStep + 1) / selectedSession.script.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isPlaying ? handlePause : () => handlePlay(selectedSession)}
              className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
                text-white font-medium transition-colors
              "
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={handleStop}
              className="
                flex items-center gap-2 px-4 py-3 rounded-lg
                border border-gray-200 dark:border-gray-600
                text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-gray-50 dark:hover:bg-gray-800
                transition-colors
              "
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="
                flex items-center gap-2 px-4 py-3 rounded-lg
                border border-gray-200 dark:border-gray-600
                text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-gray-50 dark:hover:bg-gray-800
                transition-colors
              "
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Background Sound Selector */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">Background Sound</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {Object.entries(BACKGROUND_SOUNDS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBackgroundSound(key as keyof typeof BACKGROUND_SOUNDS)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-colors
                    ${backgroundSound === key
                      ? 'bg-[#B4D4E1] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Session Selection */}
      {!selectedSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDITATION_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">
                    {session.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {session.duration} min
                    </span>
                    <span className="capitalize px-2 py-1 rounded-full bg-[#B4D4E1]/20 text-[#4A4A4A] dark:text-[#e5e5e5]">
                      {session.category}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePlay(session)}
                className="
                  w-full flex items-center justify-center gap-2 py-3 rounded-lg
                  bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
                  text-white font-medium transition-colors
                "
              >
                <Play className="w-4 h-4" />
                Start Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}