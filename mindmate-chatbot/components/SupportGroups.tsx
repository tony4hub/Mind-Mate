'use client';

import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Shield, Heart, BookOpen, Baby, Briefcase, Plus, Send, Eye, EyeOff } from 'lucide-react';
import { SupportGroup, GroupMessage } from '@/types';

const MOCK_GROUPS: SupportGroup[] = [
  {
    id: 'anxiety-support',
    name: 'Anxiety Support Circle',
    description: 'A safe space to share experiences and coping strategies for anxiety',
    category: 'anxiety',
    memberCount: 2,
    isAnonymous: true,
    moderatedBy: 'Dr. Sarah Chen'
  },
  {
    id: 'depression-help',
    name: 'Depression Support Network',
    description: 'Connect with others who understand the challenges of depression',
    category: 'depression',
    memberCount: 8,
    isAnonymous: true,
    moderatedBy: 'Licensed Counselor'
  },
  {
    id: 'student-wellness',
    name: 'Student Mental Health',
    description: 'Support for students dealing with academic stress and mental health',
    category: 'students',
    memberCount: 16,
    isAnonymous: false,
    moderatedBy: 'Campus Counselor'
  },
  
  {
    id: 'general-wellness',
    name: 'General Wellness Community',
    description: 'Open community for all mental health topics and general support',
    category: 'general',
    memberCount: 12,
    isAnonymous: true,
    moderatedBy: 'Community Team'
  }
];

const CATEGORY_ICONS = {
  anxiety: Heart,
  depression: Shield,
  general: Users,
  students: BookOpen,
  parents: Baby
};

const CATEGORY_COLORS = {
  anxiety: '#FF6B9D',
  depression: '#6BCF7F',
  general: '#B4D4E1',
  students: '#FFB74D',
  parents: '#CE93D8'
};

// Mock messages for demonstration
const MOCK_MESSAGES: { [groupId: string]: GroupMessage[] } = {
  'anxiety-support': [
    {
      id: 'msg1',
      groupId: 'anxiety-support',
      authorId: 'user1',
      authorName: 'Anonymous User',
      message: 'Had a panic attack today but used the breathing techniques we discussed. It really helped! 💙',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      supportReactions: 12,
      isAnonymous: true
    },
    {
      id: 'msg2',
      groupId: 'anxiety-support',
      authorId: 'user2',
      authorName: 'Anonymous User',
      message: 'Remember that anxiety is temporary. You are stronger than you think. Sending virtual hugs to everyone here.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      supportReactions: 8,
      isAnonymous: true
    }
  ]
};

export default function SupportGroups() {
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userName, setUserName] = useState('');
  const [hasJoinedGroups, setHasJoinedGroups] = useState<string[]>([]);

  // Load user preferences
  useEffect(() => {
    const savedName = localStorage.getItem('mindmate-username');
    const joinedGroups = localStorage.getItem('mindmate-joined-groups');
    
    if (savedName) setUserName(savedName);
    if (joinedGroups) {
      try {
        setHasJoinedGroups(JSON.parse(joinedGroups));
      } catch (error) {
        console.error('Error loading joined groups:', error);
      }
    }
  }, []);

  // Load messages for selected group
  useEffect(() => {
    if (selectedGroup) {
      const groupMessages = MOCK_MESSAGES[selectedGroup.id] || [];
      setMessages(groupMessages);
    }
  }, [selectedGroup]);

  const joinGroup = (groupId: string) => {
    if (!hasJoinedGroups.includes(groupId)) {
      const updated = [...hasJoinedGroups, groupId];
      setHasJoinedGroups(updated);
      localStorage.setItem('mindmate-joined-groups', JSON.stringify(updated));
    }
  };

  const leaveGroup = (groupId: string) => {
    const updated = hasJoinedGroups.filter(id => id !== groupId);
    setHasJoinedGroups(updated);
    localStorage.setItem('mindmate-joined-groups', JSON.stringify(updated));
    
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: GroupMessage = {
      id: `msg-${Date.now()}`,
      groupId: selectedGroup.id,
      authorId: 'current-user',
      authorName: isAnonymous ? 'Anonymous User' : (userName || 'User'),
      message: newMessage.trim(),
      timestamp: new Date(),
      supportReactions: 0,
      isAnonymous
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // In a real app, this would send to a server
    console.log('Sending message:', message);
  };

  const addSupportReaction = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, supportReactions: msg.supportReactions + 1 }
        : msg
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6BCF7F] dark:bg-[#6a9a6a] rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Support Groups
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              Connect with others who understand your journey
            </p>
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
              ${isAnonymous 
                ? 'border-[#B4D4E1] bg-[#B4D4E1]/10 text-[#B4D4E1]'
                : 'border-gray-200 dark:border-gray-600 text-[#6B6B6B] dark:text-[#b5b5b5]'
              }
            `}
          >
            {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">
              {isAnonymous ? 'Anonymous' : 'Show Name'}
            </span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              Safe & Moderated Space
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All groups are moderated by licensed professionals. Your privacy is protected, 
              and you can participate anonymously. Be kind, supportive, and respectful to others.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
            Available Groups
          </h3>
          
          {MOCK_GROUPS.map((group) => {
            const CategoryIcon = CATEGORY_ICONS[group.category];
            const categoryColor = CATEGORY_COLORS[group.category];
            const hasJoined = hasJoinedGroups.includes(group.id);
            const isSelected = selectedGroup?.id === group.id;
            
            return (
              <div
                key={group.id}
                className={`
                  bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-[#B4D4E1] bg-[#B4D4E1]/5' 
                    : 'border-black/5 dark:border-white/5 hover:border-[#B4D4E1]/50'
                  }
                `}
                onClick={() => hasJoined && setSelectedGroup(group)}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <CategoryIcon className="w-6 h-6" style={{ color: categoryColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                        {group.name}
                      </h4>
                      {group.isAnonymous && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Anonymous
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">
                      {group.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {group.memberCount} members
                        </span>
                        <span>Moderated by {group.moderatedBy}</span>
                      </div>

                      {hasJoined ? (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGroup(group);
                            }}
                            className="
                              px-3 py-1 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                              text-white text-sm transition-colors
                            "
                          >
                            Open
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              leaveGroup(group.id);
                            }}
                            className="
                              px-3 py-1 rounded-lg border border-red-200 text-red-600
                              hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20
                              text-sm transition-colors
                            "
                          >
                            Leave
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            joinGroup(group.id);
                          }}
                          className="
                            flex items-center gap-1 px-3 py-1 rounded-lg
                            border border-[#B4D4E1] text-[#B4D4E1] hover:bg-[#B4D4E1] hover:text-white
                            text-sm transition-colors
                          "
                        >
                          <Plus className="w-3 h-3" />
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Group Chat */}
        {selectedGroup ? (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5 flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${CATEGORY_COLORS[selectedGroup.category]}20` }}
                >
                  {React.createElement(CATEGORY_ICONS[selectedGroup.category], {
                    className: "w-5 h-5",
                    style: { color: CATEGORY_COLORS[selectedGroup.category] }
                  })}
                </div>
                <div>
                  <h3 className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
                    {selectedGroup.name}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                    {selectedGroup.memberCount} members • Moderated
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-[#6B6B6B] dark:text-[#b5b5b5]">
                    No messages yet. Be the first to share something supportive!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                        {message.authorName}
                      </span>
                      <span className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5]">
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                        {message.message}
                      </p>
                      
                      <button
                        onClick={() => addSupportReaction(message.id)}
                        className="
                          flex items-center gap-1 text-sm text-[#6B6B6B] dark:text-[#b5b5b5]
                          hover:text-[#B4D4E1] transition-colors
                        "
                      >
                        <Heart className="w-4 h-4" />
                        {message.supportReactions} support
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-black/5 dark:border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Share something supportive..."
                  className="
                    flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                    focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                  "
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="
                    px-4 py-2 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                    text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-[#6B6B6B] dark:text-[#b5b5b5] mt-2">
                Posting as: {isAnonymous ? 'Anonymous User' : (userName || 'User')}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-center h-[600px]">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Join a Support Group
              </h3>
              <p className="text-[#6B6B6B] dark:text-[#b5b5b5]">
                Select a group from the list to start connecting with others.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}