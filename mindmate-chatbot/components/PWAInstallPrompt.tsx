'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Check if user has already dismissed the prompt
    const hasPromptBeenDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasPromptBeenDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after user has interacted with the app for a bit
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // Show after 30 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-lg border border-black/10 dark:border-white/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[#B4D4E1] dark:bg-[#6a8a9a] rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-1">
              Install MindMate App
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">
              Get quick access to mental health support. Works offline and feels like a native app.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="
                  flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                  bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
                  text-white rounded-lg transition-colors
                "
              >
                <Download className="w-3 h-3" />
                Install
              </button>
              
              <button
                onClick={handleDismiss}
                className="
                  flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                  text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5]
                  transition-colors
                "
              >
                <X className="w-3 h-3" />
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}