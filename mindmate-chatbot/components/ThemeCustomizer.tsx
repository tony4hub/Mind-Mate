'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check, Sun, Moon, Sparkles, Briefcase } from 'lucide-react';
import { Theme } from '@/types';

const PRESET_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Calm Ocean',
    mood: 'calm',
    colors: {
      primary: '#B4D4E1',
      secondary: '#D4E8D4',
      background: '#F5F5F5',
      surface: '#FAF9F6',
      text: '#4A4A4A',
      accent: '#E8DCC4'
    }
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    mood: 'cozy',
    colors: {
      primary: '#FF8A80',
      secondary: '#FFB74D',
      background: '#FFF3E0',
      surface: '#FFECB3',
      text: '#5D4037',
      accent: '#FFCC02'
    }
  },
  {
    id: 'forest',
    name: 'Forest Zen',
    mood: 'calm',
    colors: {
      primary: '#81C784',
      secondary: '#A5D6A7',
      background: '#F1F8E9',
      surface: '#E8F5E8',
      text: '#2E7D32',
      accent: '#66BB6A'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    mood: 'cozy',
    colors: {
      primary: '#CE93D8',
      secondary: '#E1BEE7',
      background: '#F3E5F5',
      surface: '#FCE4EC',
      text: '#4A148C',
      accent: '#BA68C8'
    }
  },
  {
    id: 'energy',
    name: 'Energetic Citrus',
    mood: 'energetic',
    colors: {
      primary: '#FFB74D',
      secondary: '#FFCC02',
      background: '#FFF8E1',
      surface: '#FFFDE7',
      text: '#E65100',
      accent: '#FF9800'
    }
  },
  {
    id: 'professional',
    name: 'Professional Blue',
    mood: 'professional',
    colors: {
      primary: '#64B5F6',
      secondary: '#90CAF9',
      background: '#E3F2FD',
      surface: '#F5F5F5',
      text: '#1565C0',
      accent: '#42A5F5'
    }
  }
];

const MOOD_ICONS = {
  calm: Sun,
  cozy: Moon,
  energetic: Sparkles,
  professional: Briefcase
};

export default function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(PRESET_THEMES[0]);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('mindmate-theme-custom');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setSelectedTheme(theme);
        setCustomTheme(theme);
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);

    // Save to localStorage
    localStorage.setItem('mindmate-theme-custom', JSON.stringify(theme));
    localStorage.setItem('mindmate-theme-applied', 'true');
  };

  const createCustomTheme = () => {
    const newCustomTheme: Theme = {
      id: 'custom',
      name: 'My Custom Theme',
      mood: 'calm',
      colors: { ...selectedTheme.colors }
    };
    setCustomTheme(newCustomTheme);
    setIsCustomizing(true);
  };

  const updateCustomColor = (colorKey: keyof Theme['colors'], value: string) => {
    if (!customTheme) return;
    
    const updatedTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [colorKey]: value
      }
    };
    setCustomTheme(updatedTheme);
  };

  const saveCustomTheme = () => {
    if (!customTheme) return;
    applyTheme(customTheme);
    setIsCustomizing(false);
  };

  const resetToDefault = () => {
    applyTheme(PRESET_THEMES[0]);
    setCustomTheme(null);
    setIsCustomizing(false);
    localStorage.removeItem('mindmate-theme-custom');
    localStorage.removeItem('mindmate-theme-applied');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#CE93D8] dark:bg-[#8e6a9a] rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Theme Customizer
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              Personalize your MindMate experience
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={createCustomTheme}
            className="
              px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
              text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-gray-50 dark:hover:bg-gray-800
              transition-colors
            "
          >
            Create Custom
          </button>
          <button
            onClick={resetToDefault}
            className="
              px-4 py-2 rounded-lg
              bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
              text-white font-medium transition-colors
            "
          >
            Reset
          </button>
        </div>
      </div>

      {/* Current Theme Preview */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
        <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
          Current Theme: {selectedTheme.name}
        </h3>
        
        {/* Theme Preview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          {Object.entries(selectedTheme.colors).map(([key, color]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-600 mb-2"
                style={{ backgroundColor: color }}
              />
              <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-xs font-mono text-[#4A4A4A] dark:text-[#e5e5e5]">
                {color}
              </p>
            </div>
          ))}
        </div>

        {/* Mood Indicator */}
        <div className="flex items-center gap-2">
          {React.createElement(MOOD_ICONS[selectedTheme.mood], { 
            className: "w-5 h-5 text-[#B4D4E1]" 
          })}
          <span className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] capitalize">
            {selectedTheme.mood} mood
          </span>
        </div>
      </div>

      {/* Custom Theme Editor */}
      {isCustomizing && customTheme && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
            Customize Your Theme
          </h3>

          {/* Theme Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
              Theme Name
            </label>
            <input
              type="text"
              value={customTheme.name}
              onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
              className="
                w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
              "
            />
          </div>

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-3">
              Theme Mood
            </label>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(MOOD_ICONS).map(([mood, Icon]) => (
                <button
                  key={mood}
                  onClick={() => setCustomTheme({ ...customTheme, mood: mood as Theme['mood'] })}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all capitalize
                    ${customTheme.mood === mood
                      ? 'border-[#B4D4E1] bg-[#B4D4E1]/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-[#B4D4E1]/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Color Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(customTheme.colors).map(([key, color]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateCustomColor(key as keyof Theme['colors'], e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateCustomColor(key as keyof Theme['colors'], e.target.value)}
                    className="
                      flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                      bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                      focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] font-mono text-sm
                    "
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex gap-3">
            <button
              onClick={saveCustomTheme}
              className="
                flex-1 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                text-white font-medium transition-colors
              "
            >
              Apply Custom Theme
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className="
                px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-600
                text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-gray-50 dark:hover:bg-gray-800
                transition-colors
              "
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preset Themes */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
        <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
          Preset Themes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_THEMES.map((theme) => {
            const MoodIcon = MOOD_ICONS[theme.mood];
            const isSelected = selectedTheme.id === theme.id;
            
            return (
              <div
                key={theme.id}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-[#B4D4E1] bg-[#B4D4E1]/5' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-[#B4D4E1]/50'
                  }
                `}
                onClick={() => applyTheme(theme)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#B4D4E1] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <MoodIcon className="w-4 h-4 text-[#B4D4E1]" />
                  <h4 className="font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                    {theme.name}
                  </h4>
                </div>
                
                {/* Color Swatches */}
                <div className="flex gap-1 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                
                <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] capitalize">
                  {theme.mood} mood
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}