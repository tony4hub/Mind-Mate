'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2, Calendar, MessageCircle, Filter } from 'lucide-react';
import { Session, Message } from '@/types';

interface ChatHistoryProps {
  currentSession?: Session | null;
}

export default function ChatHistory({ currentSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'length'>('date');

  // Load sessions from localStorage
  useEffect(() => {
    const loadSessions = () => {
      const saved = localStorage.getItem('mindmate-chat-sessions');
      if (saved) {
        try {
          const parsedSessions = JSON.parse(saved).map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setSessions(parsedSessions);
        } catch (error) {
          console.error('Error loading chat sessions:', error);
        }
      }
    };

    loadSessions();
    
    // Listen for storage changes
    const handleStorageChange = () => loadSessions();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save current session when it changes
  useEffect(() => {
    if (currentSession && currentSession.messages.length > 0) {
      const existingIndex = sessions.findIndex(s => s.id === currentSession.id);
      let updatedSessions;
      
      if (existingIndex >= 0) {
        updatedSessions = [...sessions];
        updatedSessions[existingIndex] = currentSession;
      } else {
        updatedSessions = [currentSession, ...sessions];
      }
      
      // Keep only last 50 sessions
      updatedSessions = updatedSessions.slice(0, 50);
      
      localStorage.setItem('mindmate-chat-sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    }
  }, [currentSession]);

  const filteredSessions = sessions.filter(session => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hasMatchingMessage = session.messages.some(msg => 
        msg.text.toLowerCase().includes(searchLower)
      );
      if (!hasMatchingMessage) return false;
    }

    // Category filter
    switch (filterBy) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return session.createdAt >= weekAgo;
      case 'favorites':
        // Could implement favorites later
        return true;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'length':
        return b.messages.length - a.messages.length;
      case 'date':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('mindmate-chat-sessions', JSON.stringify(updatedSessions));
    
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
  };

  const exportSession = (session: Session) => {
    const content = `# MindMate Conversation - ${session.createdAt.toLocaleDateString()}

${session.messages.map(msg => 
  `**${msg.sender === 'user' ? 'You' : 'MindMate'}** (${msg.timestamp.toLocaleTimeString()}):
${msg.text}
`).join('\n')}

---
Exported from MindMate on ${new Date().toLocaleDateString()}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmate-conversation-${session.createdAt.toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
      setSessions([]);
      setSelectedSession(null);
      localStorage.removeItem('mindmate-chat-sessions');
    }
  };

  const getSessionPreview = (session: Session) => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage) return 'Empty conversation';
    
    const preview = lastMessage.text.length > 100 
      ? lastMessage.text.substring(0, 100) + '...'
      : lastMessage.text;
    
    return preview;
  };

  const getSessionStats = (session: Session) => {
    const userMessages = session.messages.filter(m => m.sender === 'user').length;
    const botMessages = session.messages.filter(m => m.sender === 'bot').length;
    const duration = session.messages.length > 1 
      ? session.messages[session.messages.length - 1].timestamp.getTime() - session.messages[0].timestamp.getTime()
      : 0;
    
    return { userMessages, botMessages, duration };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6BCF7F] dark:bg-[#6a9a6a] rounded-lg flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Chat History
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              {sessions.length} saved conversations
            </p>
          </div>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20
              transition-colors
            "
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B] dark:text-[#b5b5b5]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="
                w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
              "
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
              className="
                px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
              "
            >
              <option value="all">All</option>
              <option value="recent">Recent</option>
              <option value="favorites">Favorites</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="
                px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
              "
            >
              <option value="date">By Date</option>
              <option value="length">By Length</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                {searchTerm ? 'No matching conversations' : 'No conversations yet'}
              </h3>
              <p className="text-[#6B6B6B] dark:text-[#b5b5b5]">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters.'
                  : 'Start chatting to build your conversation history.'
                }
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const stats = getSessionStats(session);
              const isSelected = selectedSession?.id === session.id;
              
              return (
                <div
                  key={session.id}
                  className={`
                    bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-[#B4D4E1] bg-[#B4D4E1]/5' 
                      : 'border-black/5 dark:border-white/5 hover:border-[#B4D4E1]/50'
                    }
                  `}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#6B6B6B] dark:text-[#b5b5b5]" />
                        <span className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                          {session.createdAt.toLocaleDateString()} at {session.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#4A4A4A] dark:text-[#e5e5e5] line-clamp-2">
                        {getSessionPreview(session)}
                      </p>
                    </div>
                    
                    <div className="flex gap-1 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSession(session);
                        }}
                        className="p-1 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#B4D4E1] transition-colors"
                        title="Export conversation"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="p-1 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-red-500 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6B6B6B] dark:text-[#b5b5b5]">
                    <span>{session.messages.length} messages</span>
                    <span>{stats.userMessages} from you</span>
                    {stats.duration > 0 && (
                      <span>{Math.round(stats.duration / 60000)} min duration</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Session Detail */}
        {selectedSession && (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5">
            <div className="p-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
                  Conversation Details
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportSession(selectedSession)}
                    className="
                      flex items-center gap-1 px-3 py-1 rounded-lg
                      bg-[#B4D4E1] hover:bg-[#a0c4d1] text-white text-sm
                      transition-colors
                    "
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mt-1">
                {selectedSession.createdAt.toLocaleDateString()} at {selectedSession.createdAt.toLocaleTimeString()}
              </p>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`
                      flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
                    `}
                  >
                    <div
                      className={`
                        max-w-[80%] px-3 py-2 rounded-lg text-sm
                        ${message.sender === 'user'
                          ? 'bg-[#B4D4E1] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-[#4A4A4A] dark:text-[#e5e5e5]'
                        }
                      `}
                    >
                      <p>{message.text}</p>
                      <p className={`
                        text-xs mt-1 opacity-70
                        ${message.sender === 'user' ? 'text-white' : 'text-[#6B6B6B] dark:text-[#b5b5b5]'}
                      `}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}