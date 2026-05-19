'use client';

import React from 'react';
import { PlusCircle, Wind, BookOpen, Bookmark, X, Moon, Sun, Download, Heart, Headphones, Palette, Bell, History, Users, Phone } from 'lucide-react';
import { SidebarProps, QuickActionType } from '@/types';

export default function Sidebar({ onNewSession, onQuickAction, isOpen = true, onClose }: SidebarProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Load saved theme or check system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mindmate-theme') as 'light' | 'dark' | null;
      
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Update state first
    setTheme(newTheme);
    
    // Force immediate DOM update
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('mindmate-theme', newTheme);
    
    // Log for debugging
    console.log('Theme toggled to:', newTheme);
    console.log('HTML classes:', html.className);
    
    // Force a small re-render
    setTimeout(() => {
      setMounted(false);
      setTimeout(() => setMounted(true), 10);
    }, 10);
  };
  
  const quickActions: { type: QuickActionType; label: string; icon: React.ReactNode }[] = [
    { type: 'breathing', label: 'Breathing Exercise', icon: <Wind className="w-5 h-5" /> },
    { type: 'mood-tracker', label: 'Mood Tracker', icon: <Heart className="w-5 h-5" /> },
    { type: 'meditation', label: 'Guided Meditation', icon: <Headphones className="w-5 h-5" /> },
    { type: 'support-groups', label: 'Support Groups', icon: <Users className="w-5 h-5" /> },
    { type: 'chat-history', label: 'Chat History', icon: <History className="w-5 h-5" /> },
    { type: 'emergency-contacts', label: 'Emergency Contacts', icon: <Phone className="w-5 h-5" /> },
  ];

  const settingsActions: { type: QuickActionType; label: string; icon: React.ReactNode }[] = [
    { type: 'themes', label: 'Customize Theme', icon: <Palette className="w-5 h-5" /> },
    { type: 'notifications', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { type: 'export', label: 'Export Chat', icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[280px] bg-[#FAF9F6] dark:bg-[#252525] border-r border-black/5 dark:border-white/5
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
        aria-label="Main navigation"
      >
        {/* Header with logo and close button */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B4D4E1] dark:bg-[#5a8a9a] flex items-center justify-center">
              <span className="text-[#4A4A4A] dark:text-[#e5e5e5] font-semibold text-lg">M</span>
            </div>
            <h1 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">MindMate</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5]" />
            </button>
          )}
        </div>

        {/* New Session Button */}
        <div className="p-6">
          <button
            onClick={onNewSession}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-3 rounded-2xl
              bg-[#B4D4E1] hover:bg-[#A0C4D1]
              text-[#4A4A4A] font-medium
              transition-all duration-200
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
            "
            aria-label="Start new session"
          >
            <PlusCircle className="w-5 h-5" />
            New Session
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 flex-1">
          <h2 className="text-sm font-medium text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.type}
                onClick={() => onQuickAction(action.type)}
                className="
                  w-full flex items-center gap-3
                  px-4 py-3 rounded-xl
                  text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-white/60 dark:hover:bg-white/5
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
                  text-left
                "
                aria-label={action.label}
              >
                <span className="text-[#6B6B6B] dark:text-[#b5b5b5]">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-6 pb-4 space-y-2">
          <h2 className="text-sm font-medium text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">Settings</h2>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-white/60 dark:hover:bg-white/5
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
              text-left
            "
            aria-label="Toggle theme"
          >
            <span className="text-[#6B6B6B] dark:text-[#b5b5b5]">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </span>
            <span className="text-sm font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Settings Actions */}
          {settingsActions.map((action) => (
            <button
              key={action.type}
              onClick={() => onQuickAction(action.type)}
              className="
                w-full flex items-center gap-3
                px-4 py-3 rounded-xl
                text-[#4A4A4A] dark:text-[#e5e5e5] hover:bg-white/60 dark:hover:bg-white/5
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
                text-left
              "
              aria-label={action.label}
            >
              <span className="text-[#6B6B6B] dark:text-[#b5b5b5]">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 dark:border-white/5">
          <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] text-center">
            You&apos;re not alone. We&apos;re here to help.
          </p>
        </div>
      </nav>
    </>
  );
}
