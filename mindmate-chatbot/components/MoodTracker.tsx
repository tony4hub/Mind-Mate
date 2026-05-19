'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Heart, Zap, AlertTriangle, Plus, X } from 'lucide-react';
import { MoodEntry, MoodLevel, MoodStats } from '@/types';

const MOOD_COLORS = {
  terrible: '#FF6B6B',
  bad: '#FF8E53',
  okay: '#FFD93D',
  good: '#6BCF7F',
  great: '#4ECDC4'
};

const MOOD_EMOJIS = {
  terrible: '😢',
  bad: '😔',
  okay: '😐',
  good: '😊',
  great: '😄'
};

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<MoodLevel>('okay');
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Load mood entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindmate-mood-entries');
    if (saved) {
      const entries = JSON.parse(saved).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setMoodEntries(entries);
    }
  }, []);

  // Save mood entries to localStorage
  const saveMoodEntries = (entries: MoodEntry[]) => {
    localStorage.setItem('mindmate-mood-entries', JSON.stringify(entries));
    setMoodEntries(entries);
  };

  const handleSubmitMood = () => {
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: new Date(),
      mood: currentMood,
      energy,
      anxiety,
      notes: notes.trim(),
      activities: activities.filter(a => a.trim()),
      triggers: [] // Could be expanded later
    };

    const updatedEntries = [newEntry, ...moodEntries];
    saveMoodEntries(updatedEntries);

    // Reset form
    setCurrentMood('okay');
    setEnergy(5);
    setAnxiety(5);
    setNotes('');
    setActivities([]);
    setShowForm(false);
  };

  const addActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
  };

  const getMoodStats = (): MoodStats => {
    if (moodEntries.length === 0) {
      return {
        averageMood: 3,
        moodTrend: 'stable',
        commonTriggers: [],
        bestActivities: [],
        streakDays: 0
      };
    }

    const moodValues = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 };
    const avgMood = moodEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / moodEntries.length;
    
    // Simple trend calculation (last 7 days vs previous 7 days)
    const recent = moodEntries.slice(0, 7);
    const previous = moodEntries.slice(7, 14);
    const recentAvg = recent.length > 0 ? recent.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recent.length : avgMood;
    const previousAvg = previous.length > 0 ? previous.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / previous.length : avgMood;
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg > previousAvg + 0.3) trend = 'improving';
    else if (recentAvg < previousAvg - 0.3) trend = 'declining';

    // Count consecutive days with entries
    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < moodEntries.length; i++) {
      const entryDate = new Date(moodEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === i) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      averageMood: avgMood,
      moodTrend: trend,
      commonTriggers: [],
      bestActivities: [],
      streakDays
    };
  };

  const stats = getMoodStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#B4D4E1] dark:bg-[#6a8a9a] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Mood Tracker
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              Track your daily mood and energy
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
            text-white font-medium transition-colors
          "
        >
          <Plus className="w-4 h-4" />
          Log Mood
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <TrendingUp className={`w-5 h-5 ${
              stats.moodTrend === 'improving' ? 'text-green-500' :
              stats.moodTrend === 'declining' ? 'text-red-500' : 'text-blue-500'
            }`} />
            <div>
              <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">Trend</p>
              <p className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] capitalize">
                {stats.moodTrend}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#B4D4E1]" />
            <div>
              <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">Streak</p>
              <p className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
                {stats.streakDays} days
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <div>
              <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">Average</p>
              <p className="font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
                {stats.averageMood.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Entry Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
            How are you feeling today?
          </h3>

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-3">
              Overall Mood
            </label>
            <div className="flex gap-3 flex-wrap">
              {(Object.keys(MOOD_EMOJIS) as MoodLevel[]).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                    ${currentMood === mood 
                      ? 'border-[#B4D4E1] bg-[#B4D4E1]/10' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-[#B4D4E1]/50'
                    }
                  `}
                >
                  <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                  <span className="text-xs font-medium capitalize text-[#4A4A4A] dark:text-[#e5e5e5]">
                    {mood}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Anxiety Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Energy Level: {energy}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Anxiety Level: {anxiety}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxiety}
                onChange={(e) => setAnxiety(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
              Activities Today
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addActivity()}
                placeholder="Add an activity..."
                className="
                  flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
              <button
                onClick={addActivity}
                className="
                  px-4 py-2 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                  text-white font-medium transition-colors
                "
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity, index) => (
                <span
                  key={index}
                  className="
                    flex items-center gap-1 px-3 py-1 rounded-full
                    bg-[#B4D4E1]/20 text-[#4A4A4A] dark:text-[#e5e5e5] text-sm
                  "
                >
                  {activity}
                  <button
                    onClick={() => removeActivity(activity)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your day? Any thoughts or reflections..."
              rows={3}
              className="
                w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] resize-none
              "
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitMood}
              className="
                flex-1 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                text-white font-medium transition-colors
              "
            >
              Save Mood Entry
            </button>
            <button
              onClick={() => setShowForm(false)}
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

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
            Recent Entries
          </h3>
          <div className="space-y-3">
            {moodEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-[#4A4A4A] dark:text-[#e5e5e5]">
                      {entry.date.toLocaleDateString()}
                    </span>
                    <span className="text-[#6B6B6B] dark:text-[#b5b5b5]">
                      Energy: {entry.energy}/10
                    </span>
                    <span className="text-[#6B6B6B] dark:text-[#b5b5b5]">
                      Anxiety: {entry.anxiety}/10
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mt-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}