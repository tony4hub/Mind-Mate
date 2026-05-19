'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Resource } from '@/types';
import ResourceCard from './ResourceCard';

interface RecommendedResourcesProps {
  resources: Resource[];
}

export default function RecommendedResources({ resources }: RecommendedResourcesProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex p-3 bg-[#E8DCC4]/20 rounded-full mb-3">
          <Lightbulb className="w-6 h-6 text-[#6B6B6B]" />
        </div>
        <h3 className="text-sm font-semibold text-[#4A4A4A] mb-2">
          Recommended Resources
        </h3>
        <p className="text-xs text-[#6B6B6B]">
          Resources will appear here based on your conversation
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-[#6B6B6B]" />
        <h3 className="text-sm font-semibold text-[#4A4A4A]">
          Recommended for You
        </h3>
      </div>
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
