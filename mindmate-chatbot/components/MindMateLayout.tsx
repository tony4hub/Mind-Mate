'use client';

import React from 'react';
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { UIProvider, useUI } from '@/contexts/UIContext';
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import EmergencyPanel from './EmergencyPanel';
import BreathingExercise from './BreathingExercise';
import MoodTracker from './MoodTracker';
import GuidedMeditation from './GuidedMeditation';
import ThemeCustomizer from './ThemeCustomizer';
import NotificationCenter from './NotificationCenter';
import ChatHistory from './ChatHistory';
import SupportGroups from './SupportGroups';
import EmergencyContacts from './EmergencyContacts';
import CrisisAlertModal from './CrisisAlertModal';
import { QuickActionType } from '@/types';
import { downloadConversation } from '@/utils/exportConversation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function MindMateContent() {
  const { 
    session, 
    createNewSession, 
    addMessage, 
    updateContext, 
    sendMessage,
    crisisModalVisible,
    currentCrisisData,
    hideCrisisModal,
    handleEmergencyCall,
    handleEmergencySMS,
    handleEmergencyEmail,
    handleAutoEmail
  } = useSession();
  const { sidebarOpen, setSidebarOpen, emergencyPanelCollapsed, toggleEmergencyPanel, isLoading, setIsLoading } = useUI();
  const [currentView, setCurrentView] = React.useState<'chat' | QuickActionType>('chat');
  const [showBreathingExercise, setShowBreathingExercise] = React.useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  // Initialize with a session on mount
  React.useEffect(() => {
    if (!session) {
      createNewSession();
    }
  }, [session, createNewSession]);

  const handleNewSession = () => {
    createNewSession();
    setCurrentView('chat');
  };

  const handleQuickAction = (action: QuickActionType) => {
    console.log('Quick action:', action);
    
    // Handle special actions
    if (action === 'breathing') {
      setShowBreathingExercise(true);
      return;
    }
    
    if (action === 'export') {
      if (session && session.messages.length > 0) {
        downloadConversation(session, 'markdown');
      } else {
        alert('No conversation to export yet. Start chatting first!');
      }
      return;
    }
    
    // Handle view changes for new features
    if (['mood-tracker', 'meditation', 'themes', 'notifications', 'chat-history', 'support-groups', 'emergency-contacts'].includes(action)) {
      setCurrentView(action);
      return;
    }
    
    // Legacy actions - add to chat
    addMessage(`I'd like to try the ${action.replace('-', ' ')} feature`, 'user');
    
    // Simulate bot response
    setTimeout(() => {
      addMessage(`Great! Let me help you with ${action.replace('-', ' ')}.`, 'bot');
    }, 1000);
  };

  const handleSendMessage = async (text: string) => {
    // Stop any ongoing speech
    if (isSpeaking) {
      stop();
    }
    
    // Use the new sendMessage from SessionContext which handles crisis detection
    await sendMessage(text);
  };

  const messages = session?.messages || [];
  const recommendedResources = session?.context.recommendedResources || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5] dark:bg-[#2a2a2a]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#FAF9F6] dark:bg-[#252525] border-b border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-[#4A4A4A] dark:text-[#e5e5e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">MindMate</h1>
        <button
          onClick={toggleEmergencyPanel}
          className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Toggle resources"
        >
          <svg className="w-6 h-6 text-[#4A4A4A] dark:text-[#e5e5e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        onNewSession={handleNewSession}
        onQuickAction={handleQuickAction}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:mt-0 mt-[60px] overflow-hidden">
        {currentView === 'chat' && (
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
        
        {currentView === 'mood-tracker' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <MoodTracker />
            </div>
          </div>
        )}
        
        {currentView === 'meditation' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <GuidedMeditation />
            </div>
          </div>
        )}
        
        {currentView === 'themes' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <ThemeCustomizer />
            </div>
          </div>
        )}
        
        {currentView === 'notifications' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <NotificationCenter />
            </div>
          </div>
        )}
        
        {currentView === 'chat-history' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <ChatHistory currentSession={session} />
            </div>
          </div>
        )}
        
        {currentView === 'support-groups' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <SupportGroups />
            </div>
          </div>
        )}
        
        {currentView === 'emergency-contacts' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[#FAF9F6] dark:bg-[#252525]">
              <button
                onClick={() => setCurrentView('chat')}
                className="flex items-center gap-2 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#4A4A4A] dark:hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
            </div>
            <div className="p-6">
              <EmergencyContacts />
            </div>
          </div>
        )}
      </div>

      {/* Emergency Panel */}
      <EmergencyPanel
        isCollapsed={emergencyPanelCollapsed}
        onToggle={toggleEmergencyPanel}
        recommendedResources={recommendedResources}
      />

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
      )}

      {/* Crisis Alert Modal */}
      {crisisModalVisible && currentCrisisData && currentCrisisData.severity !== 'none' && (
        <CrisisAlertModal
          isVisible={crisisModalVisible}
          severity={currentCrisisData.severity as 'critical' | 'high' | 'medium'}
          detectedKeywords={currentCrisisData.detectedKeywords}
          emergencyContacts={[]} // Will be populated from API
          onClose={hideCrisisModal}
          onCallEmergency={handleEmergencyCall}
          onSendSMS={handleEmergencySMS}
          onSendEmail={handleEmergencyEmail}
          onAutoEmailSent={handleAutoEmail}
        />
      )}
    </div>
  );
}

export default function MindMateLayout() {
  return (
    <SessionProvider>
      <UIProvider>
        <MindMateContent />
      </UIProvider>
    </SessionProvider>
  );
}
