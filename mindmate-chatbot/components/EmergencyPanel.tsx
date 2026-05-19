'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EmergencyPanelProps } from '@/types';
import SOSCard from './SOSCard';
import RecommendedResources from './RecommendedResources';

export default function EmergencyPanel({
  isCollapsed,
  onToggle,
  recommendedResources,
}: EmergencyPanelProps) {
  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed md:static inset-y-0 right-0 z-50
          w-[320px] bg-[#FAF9F6] dark:bg-[#252525] border-l border-black/5 dark:border-white/5
          transform transition-transform duration-300 ease-in-out
          ${isCollapsed ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}
          flex flex-col
          overflow-y-auto
        `}
        aria-label="Emergency resources and recommendations"
      >
        {/* Toggle button */}
        <div className="sticky top-0 bg-[#FAF9F6] dark:bg-[#252525] border-b border-black/5 dark:border-white/5 p-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">Resources</h2>
          <button
            onClick={onToggle}
            className="
              p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] focus:ring-offset-2
            "
            aria-label={isCollapsed ? 'Expand resources panel' : 'Collapse resources panel'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5]" />
            ) : (
              <>
                <ChevronRight className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5] hidden md:block" />
                <X className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5] md:hidden" />
              </>
            )}
          </button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="p-6 space-y-6">
            <SOSCard
              emergencyNumbers={[
                {
                  id: 'suicide-prevention',
                  name: 'National Suicide Prevention Lifeline',
                  relationship: 'Crisis Support',
                  phone: '988',
                  email: '',
                  canReceiveAlerts: false,
                  priority: 1,
                },
                {
                  id: 'crisis-text',
                  name: 'Crisis Text Line',
                  relationship: 'Crisis Support',
                  phone: '',
                  email: '',
                  canReceiveAlerts: false,
                  priority: 1,
                },
                {
                  id: 'kiran-helpline',
                  name: 'KIRAN Mental Health',
                  relationship: 'Crisis Support',
                  phone: '123456789',
                  email: '',
                  canReceiveAlerts: false,
                  priority: 1,
                },
              ]}
            />

            <RecommendedResources resources={recommendedResources} />
          </div>
        )}
      </aside>

      {/* Collapsed state button (desktop only) */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="
            hidden md:flex
            fixed right-0 top-1/2 -translate-y-1/2
            bg-[#FAF9F6] dark:bg-[#252525] border border-black/5 dark:border-white/5 rounded-l-lg
            p-2 shadow-md
            hover:bg-white dark:hover:bg-[#2a2a2a]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
            z-30
          "
          aria-label="Expand resources panel"
        >
          <ChevronLeft className="w-5 h-5 text-[#6B6B6B] dark:text-[#b5b5b5]" />
        </button>
      )}
    </>
  );
}
