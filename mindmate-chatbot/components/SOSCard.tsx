'use client';

import React from 'react';
import { AlertCircle, Phone } from 'lucide-react';
import { SOSCardProps } from '@/types';

export default function SOSCard({ emergencyNumbers }: SOSCardProps) {
  return (
    <div
      className="
        bg-white rounded-2xl border-2 border-[#F4A5A5]
        shadow-[0_4px_12px_rgba(244,165,165,0.2)]
        p-5
      "
      role="region"
      aria-label="Emergency crisis resources"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#F4A5A5]/10 rounded-full">
          <AlertCircle className="w-6 h-6 text-[#F4A5A5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#4A4A4A]">
          Crisis Help
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-[#6B6B6B] mb-4">
        If you&apos;re in crisis or need immediate support, please reach out to these resources:
      </p>

      {/* Emergency contacts */}
      <div className="space-y-3">
        {emergencyNumbers.map((contact, index) => (
          <div
            key={index}
            className="
              p-3 rounded-xl bg-[#FAF9F6]
              border border-black/5
              hover:border-[#F4A5A5]/30
              transition-colors duration-200
            "
          >
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#F4A5A5] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#4A4A4A] mb-0.5">
                  {contact.name}
                </p>
                <a
                  href={`tel:${contact.phone.replace(/\D/g, '')}`}
                  className="
                    text-base font-bold text-[#F4A5A5]
                    hover:underline focus:underline
                    focus:outline-none
                    block mb-1
                  "
                  aria-label={`Call ${contact.name} at ${contact.phone}`}
                >
                  {contact.phone}
                </a>
                <p className="text-xs text-[#6B6B6B]">
                  {contact.relationship}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-[#6B6B6B] mt-4 text-center">
        You deserve support. These services are free and confidential.
      </p>
    </div>
  );
}
