'use client';

import React from 'react';
import { FileText, Video, Activity, ExternalLink } from 'lucide-react';
import { ResourceCardProps } from '@/types';

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.type) {
      case 'article':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'exercise':
        return <Activity className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    return resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
  };

  const content = (
    <div
      className="
        p-4 rounded-xl bg-white
        border border-black/5
        hover:border-[#B4D4E1]/50 hover:shadow-md
        transition-all duration-200
        group
      "
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#B4D4E1]/10 rounded-lg text-[#4A4A4A] flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-[#4A4A4A] line-clamp-2 group-hover:text-[#4A4A4A]">
              {resource.title}
            </h4>
            {resource.url && (
              <ExternalLink className="w-4 h-4 text-[#6B6B6B] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <p className="text-xs text-[#6B6B6B] mb-2 line-clamp-2">
            {resource.description}
          </p>
          <span className="inline-block px-2 py-1 text-xs font-medium text-[#4A4A4A] bg-[#E8DCC4]/30 rounded-full">
            {getTypeLabel()}
          </span>
        </div>
      </div>
    </div>
  );

  if (resource.url) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-[#B4D4E1] rounded-xl"
        aria-label={`Open ${resource.title} in new tab`}
      >
        {content}
      </a>
    );
  }

  return content;
}
