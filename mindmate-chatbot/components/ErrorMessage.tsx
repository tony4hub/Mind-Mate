'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="
        flex items-start gap-3 p-4 rounded-xl
        bg-[#F4A5A5]/10 border border-[#F4A5A5]/30
        text-[#4A4A4A]
      "
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-5 h-5 text-[#F4A5A5] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="
              mt-2 text-sm font-medium text-[#4A4A4A]
              hover:underline focus:underline
              focus:outline-none
            "
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
