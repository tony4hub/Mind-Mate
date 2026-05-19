'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Phone, MessageSquare, Mail, X, Heart, Shield } from 'lucide-react';

interface EmergencyContact {
  name: string;
  number: string;
  email: string;
  description: string;
}

interface CrisisAlertModalProps {
  isVisible: boolean;
  severity: 'critical' | 'high' | 'medium';
  detectedKeywords: string[];
  emergencyContacts: EmergencyContact[];
  onClose: () => void;
  onCallEmergency: () => void;
  onSendSMS: () => void;
  onSendEmail: () => void;
  onAutoEmailSent: () => void;
}

export default function CrisisAlertModal({ 
  isVisible, 
  severity, 
  detectedKeywords,
  emergencyContacts,
  onClose, 
  onCallEmergency, 
  onSendSMS,
  onSendEmail,
  onAutoEmailSent
}: CrisisAlertModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(severity === 'critical');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Reset countdown when modal opens
    setCountdown(10);
    setEmailSent(false);
    setAutoEmailEnabled(severity === 'critical');
  }, [isVisible, severity]);

  useEffect(() => {
    if (!isVisible || !autoEmailEnabled || emailSent) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-send email when countdown reaches zero
          handleAutoEmail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, autoEmailEnabled, emailSent]);

  const handleAutoEmail = async () => {
    if (!emailSent) {
      setEmailSent(true);
      setAutoEmailEnabled(false);
      onAutoEmailSent();
    }
  };

  const handleUserAction = (action: () => void) => {
    // Stop countdown when user takes any action
    setAutoEmailEnabled(false);
    action();
  };

  if (!isVisible) return null;

  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          color: '#FF4444',
          bgColor: '#FF4444',
          title: '🚨 CRITICAL ALERT',
          description: 'We detected you may be in immediate danger. Emergency contacts are being notified.',
          showAutoCall: true
        };
      case 'high':
        return {
          color: '#FF8800',
          bgColor: '#FF8800',
          title: '⚠️ HIGH PRIORITY ALERT',
          description: 'We detected concerning language. Please reach out for support.',
          showAutoCall: false
        };
      case 'medium':
        return {
          color: '#FFA500',
          bgColor: '#FFA500',
          title: '💛 SUPPORT AVAILABLE',
          description: 'It sounds like you might be going through a difficult time. Help is available.',
          showAutoCall: false
        };
      default:
        return {
          color: '#FF4444',
          bgColor: '#FF4444',
          title: '🚨 ALERT',
          description: 'We want to make sure you\'re safe.',
          showAutoCall: false
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        style={{ borderLeft: `6px solid ${config.color}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="mb-4">
            <AlertTriangle size={48} color={config.color} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {config.title}
          </h2>
          <p className="text-gray-600">
            {config.description}
          </p>
        </div>

        {autoEmailEnabled && !emailSent && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-red-800 font-medium">
                ⚠️ Auto-emailing emergency contacts in {countdown}s
              </span>
              <button
                onClick={() => setAutoEmailEnabled(false)}
                className="text-red-600 underline text-sm hover:text-red-800"
              >
                Cancel Auto-Email
              </button>
            </div>
            <p className="text-red-600 text-sm mt-2">
              Click any action below to stop the countdown
            </p>
          </div>
        )}

        {emailSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-green-800 font-medium">
                ✅ Emergency contacts have been notified automatically
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleUserAction(onCallEmergency)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Phone size={20} />
            Call Emergency Services (999)
          </button>

          <button
            onClick={() => handleUserAction(onSendSMS)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare size={20} />
            Send SMS to Emergency Contacts
          </button>

          <button
            onClick={() => handleUserAction(onSendEmail)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Mail size={20} />
            Send Email to Emergency Contacts
          </button>

          <div className="text-center pt-4">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Heart size={16} />
              <span className="text-sm">You are not alone</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield size={16} />
              <span className="text-sm">Your safety is our priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}