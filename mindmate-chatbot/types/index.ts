// Core data models
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ConversationContext {
  topics: string[]; // e.g., ['anxiety', 'sleep']
  sentiment: 'positive' | 'neutral' | 'negative' | 'crisis';
  recommendedResources: Resource[];
}

export interface Session {
  id: string;
  createdAt: Date;
  messages: Message[];
  context: ConversationContext;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url?: string;
  type: 'article' | 'video' | 'exercise';
}

// Mood Tracking Types
export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodLevel;
  energy: number; // 1-10
  anxiety: number; // 1-10
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

export type MoodLevel = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodStats {
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  commonTriggers: string[];
  bestActivities: string[];
  streakDays: number;
}

// Meditation Types
export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  category: 'anxiety' | 'sleep' | 'focus' | 'stress' | 'general';
  audioUrl?: string;
  script: string[];
  backgroundSound?: 'rain' | 'ocean' | 'forest' | 'silence';
}

// Theme Types
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  mood: 'calm' | 'energetic' | 'cozy' | 'professional';
}

// Notification Types
export interface Reminder {
  id: string;
  type: 'mood_check' | 'meditation' | 'breathing' | 'custom';
  title: string;
  message: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
}

// Social Features
export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'general' | 'students' | 'parents';
  memberCount: number;
  isAnonymous: boolean;
  moderatedBy: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  message: string;
  timestamp: Date;
  supportReactions: number;
  isAnonymous: boolean;
}

// Emergency Contacts
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  canReceiveAlerts: boolean;
  priority: number; // 1-5
}

// UI State
export interface UIState {
  sidebarOpen: boolean;
  emergencyPanelCollapsed: boolean;
  currentSession: Session | null;
  isLoading: boolean;
  inputValue: string;
}

// Quick Actions
export type QuickActionType = 
  | 'breathing' 
  | 'journaling' 
  | 'saved-resources' 
  | 'export'
  | 'mood-tracker'
  | 'meditation'
  | 'themes'
  | 'notifications'
  | 'chat-history'
  | 'support-groups'
  | 'emergency-contacts';

// Component Props
export interface MindMateLayoutProps {
  children?: React.ReactNode;
  initialSession?: Session;
}

export interface SidebarProps {
  onNewSession: () => void;
  onQuickAction: (action: QuickActionType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export interface StartingChipsProps {
  chips: string[];
  onChipClick: (text: string) => void;
}

export interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface EmergencyPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  recommendedResources: Resource[];
}

export interface SOSCardProps {
  emergencyNumbers: EmergencyContact[];
}

export interface MessageProps {
  message: Message;
}

export interface ResourceCardProps {
  resource: Resource;
}
