'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, Clock, Calendar, ToggleLeft, ToggleRight, Heart, Headphones, Wind } from 'lucide-react';
import { Reminder } from '@/types';

const REMINDER_TYPES = {
  mood_check: { icon: Heart, label: 'Mood Check-in', color: '#FF6B9D' },
  meditation: { icon: Headphones, label: 'Meditation', color: '#6BCF7F' },
  breathing: { icon: Wind, label: 'Breathing Exercise', color: '#4ECDC4' },
  custom: { icon: Bell, label: 'Custom Reminder', color: '#B4D4E1' }
};

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun', full: 'Sunday' },
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' }
];

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'morning-checkin',
    type: 'mood_check',
    title: 'Morning Check-in',
    message: 'How are you feeling this morning? Take a moment to log your mood.',
    time: '09:00',
    days: [1, 2, 3, 4, 5], // Weekdays
    enabled: true
  },
  {
    id: 'evening-meditation',
    type: 'meditation',
    title: 'Evening Meditation',
    message: 'Wind down with a peaceful meditation session.',
    time: '20:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    enabled: false
  },
  {
    id: 'midday-breathing',
    type: 'breathing',
    title: 'Midday Breathing',
    message: 'Take a quick breathing break to reset your energy.',
    time: '14:00',
    days: [1, 2, 3, 4, 5], // Weekdays
    enabled: false
  }
];

export default function NotificationCenter() {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    type: 'custom',
    title: '',
    message: '',
    time: '12:00',
    days: [1, 2, 3, 4, 5],
    enabled: true
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Load reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindmate-reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save reminders to localStorage
  const saveReminders = (updatedReminders: Reminder[]) => {
    localStorage.setItem('mindmate-reminders', JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('MindMate Notifications Enabled', {
          body: 'You\'ll now receive gentle reminders for your mental health.',
          icon: '/icons/icon-192x192.svg',
          badge: '/icons/icon-72x72.svg'
        });
      }
    }
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updated);
  };

  const addReminder = () => {
    if (!newReminder.title || !newReminder.message) return;

    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      type: newReminder.type as Reminder['type'],
      title: newReminder.title,
      message: newReminder.message,
      time: newReminder.time || '12:00',
      days: newReminder.days || [1, 2, 3, 4, 5],
      enabled: true
    };

    saveReminders([...reminders, reminder]);
    setNewReminder({
      type: 'custom',
      title: '',
      message: '',
      time: '12:00',
      days: [1, 2, 3, 4, 5],
      enabled: true
    });
    setShowAddForm(false);
  };

  const toggleDay = (dayId: number) => {
    const currentDays = newReminder.days || [];
    const updatedDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId].sort();
    
    setNewReminder({ ...newReminder, days: updatedDays });
  };

  const formatDays = (days: number[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    
    return days
      .sort()
      .map(d => DAYS_OF_WEEK.find(day => day.id === d)?.label)
      .join(', ');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Schedule notifications (simplified - in a real app, you'd use a service worker)
  useEffect(() => {
    if (!notificationsEnabled) return;

    const scheduleNotifications = () => {
      reminders.forEach(reminder => {
        if (!reminder.enabled) return;

        const now = new Date();
        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        reminder.days.forEach(dayOfWeek => {
          const notificationTime = new Date();
          notificationTime.setHours(hours, minutes, 0, 0);
          
          // Adjust for the correct day of the week
          const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
          notificationTime.setDate(now.getDate() + daysUntilTarget);
          
          // If the time has passed today, schedule for next week
          if (daysUntilTarget === 0 && notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 7);
          }

          const timeUntilNotification = notificationTime.getTime() - now.getTime();
          
          if (timeUntilNotification > 0) {
            setTimeout(() => {
              if (document.visibilityState === 'hidden') {
                const ReminderIcon = REMINDER_TYPES[reminder.type].icon;
                new Notification(reminder.title, {
                  body: reminder.message,
                  icon: '/icons/icon-192x192.svg',
                  badge: '/icons/icon-72x72.svg',
                  tag: reminder.id,
                  requireInteraction: false
                });
              }
            }, timeUntilNotification);
          }
        });
      });
    };

    scheduleNotifications();
  }, [reminders, notificationsEnabled]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B9D] dark:bg-[#9a6a8a] rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Notifications & Reminders
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              Stay on track with gentle reminders
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
            text-white font-medium transition-colors
          "
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Notification Permission */}
      {permissionStatus !== 'granted' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Enable Notifications
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                Allow notifications to receive gentle reminders for your mental health activities.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="
                  px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700
                  text-white font-medium transition-colors
                "
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
            Create New Reminder
          </h3>

          {/* Reminder Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-3">
              Reminder Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(REMINDER_TYPES).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setNewReminder({ ...newReminder, type: type as Reminder['type'] })}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${newReminder.type === type
                        ? 'border-[#B4D4E1] bg-[#B4D4E1]/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-[#B4D4E1]/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <span className="text-xs font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title and Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Title
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="e.g., Morning Meditation"
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Time
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
              Message
            </label>
            <textarea
              value={newReminder.message}
              onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
              placeholder="e.g., Take a moment to breathe and center yourself"
              rows={3}
              className="
                w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] resize-none
              "
            />
          </div>

          {/* Days Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-3">
              Repeat on
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all
                    ${(newReminder.days || []).includes(day.id)
                      ? 'border-[#B4D4E1] bg-[#B4D4E1] text-white'
                      : 'border-gray-200 dark:border-gray-600 text-[#4A4A4A] dark:text-[#e5e5e5] hover:border-[#B4D4E1]/50'
                    }
                  `}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addReminder}
              disabled={!newReminder.title || !newReminder.message}
              className="
                flex-1 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                text-white font-medium transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Create Reminder
            </button>
            <button
              onClick={() => setShowAddForm(false)}
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

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((reminder) => {
          const ReminderIcon = REMINDER_TYPES[reminder.type].icon;
          const iconColor = REMINDER_TYPES[reminder.type].color;
          
          return (
            <div
              key={reminder.id}
              className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <ReminderIcon className="w-5 h-5" style={{ color: iconColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                      {reminder.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="text-[#B4D4E1] hover:text-[#a0c4d1] transition-colors"
                      >
                        {reminder.enabled ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-3">
                    {reminder.message}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(reminder.time)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDays(reminder.days)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
            No reminders yet
          </h3>
          <p className="text-[#6B6B6B] dark:text-[#b5b5b5] mb-4">
            Create your first reminder to stay on track with your mental health goals.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="
              px-6 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
              text-white font-medium transition-colors
            "
          >
            Create First Reminder
          </button>
        </div>
      )}
    </div>
  );
}