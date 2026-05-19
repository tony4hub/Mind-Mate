'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Plus, Edit, Trash2, AlertTriangle, Send, Shield, Heart, Star } from 'lucide-react';
import { EmergencyContact } from '@/types';

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'emergency-contact-1',
    name: 'Emergency Contact 1',
    relationship: 'Friend',
    phone: '',
    email: '',
    canReceiveAlerts: true,
    priority: 1
  },
  {
    id: 'emergency-contact-2',
    name: 'Emergency Contact 2',
    relationship: 'Family',
    phone: '',
    email: '',
    canReceiveAlerts: false,
    priority: 2
  }
];

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(DEFAULT_CONTACTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    canReceiveAlerts: true,
    priority: 3
  });
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Load contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindmate-emergency-contacts');
    if (saved) {
      try {
        const savedContacts = JSON.parse(saved);
        // Merge with default contacts, avoiding duplicates
        const merged = [...DEFAULT_CONTACTS];
        savedContacts.forEach((contact: EmergencyContact) => {
          if (!merged.find(c => c.id === contact.id)) {
            merged.push(contact);
          }
        });
        setContacts(merged.sort((a, b) => a.priority - b.priority));
      } catch (error) {
        console.error('Error loading emergency contacts:', error);
      }
    }
  }, []);

  // Save contacts to localStorage
  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    const userContacts = updatedContacts.filter(c => !DEFAULT_CONTACTS.find(dc => dc.id === c.id));
    localStorage.setItem('mindmate-emergency-contacts', JSON.stringify(userContacts));
    setContacts(updatedContacts.sort((a, b) => a.priority - b.priority));
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      relationship: newContact.relationship || 'Family',
      phone: newContact.phone,
      email: newContact.email || '',
      canReceiveAlerts: newContact.canReceiveAlerts ?? true,
      priority: newContact.priority || 3
    };

    saveContacts([...contacts, contact]);
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      canReceiveAlerts: true,
      priority: 3
    });
    setShowAddForm(false);
  };

  const updateContact = () => {
    if (!editingContact) return;

    const updated = contacts.map(c => 
      c.id === editingContact.id ? editingContact : c
    );
    saveContacts(updated);
    setEditingContact(null);
  };

  const deleteContact = (id: string) => {
    // Don't allow deleting default contacts
    if (DEFAULT_CONTACTS.find(c => c.id === id)) return;
    
    if (confirm('Are you sure you want to delete this contact?')) {
      const updated = contacts.filter(c => c.id !== id);
      saveContacts(updated);
    }
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const testEmailConfiguration = async () => {
    const testEmail = prompt('Enter your email address to test the email configuration:');
    if (!testEmail) return;

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Test email sent successfully to ${testEmail}! Check your inbox to confirm the email system is working.`);
      } else {
        alert(`Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error testing email:', error);
      alert('Failed to test email configuration. Please check your network connection.');
    }
  };

  const sendEmergencyAlert = async () => {
    const alertContacts = contacts.filter(c => c.canReceiveAlerts && c.email);
    
    if (alertContacts.length === 0) {
      alert('No contacts are set up to receive emergency alerts. Please add email addresses to your contacts.');
      return;
    }

    const message = emergencyMessage || 'I need support right now. Please check on me when you can.';
    
    try {
      // Send emergency alert via API
      const response = await fetch('/api/emergency-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'email',
          contactIds: [], // Send to all contacts
          crisisData: {
            severity: 'high',
            detectedKeywords: ['manual emergency alert'],
            timestamp: new Date().toISOString(),
            conversationContext: `User manually sent emergency alert: "${message}"`,
          },
          sessionId: `manual-alert-${Date.now()}`,
          customMessage: message,
          customContacts: alertContacts.map(c => ({
            id: c.id,
            name: c.name,
            number: c.phone,
            email: c.email,
            description: `${c.relationship} - Priority ${c.priority}`
          }))
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Emergency alert sent successfully to ${result.contactsReached?.length || 0} contact(s): ${alertContacts.map(c => c.name).join(', ')}`);
      } else {
        alert(`Failed to send emergency alert. Please try again or contact emergency services directly.`);
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      alert('Failed to send emergency alert due to network error. Please try again or contact emergency services directly.');
    }
    
    setEmergencyMessage('');
    setShowEmergencyAlert(false);
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Critical';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      default: return 'Medium';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return '#FF6B6B';
      case 2: return '#FF8E53';
      case 3: return '#FFD93D';
      case 4: return '#6BCF7F';
      default: return '#FFD93D';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B6B] dark:bg-[#9a6a6a] rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
              Emergency Contacts
            </h2>
            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
              Manage your support network and emergency alerts
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEmergencyAlert(true)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-red-500 hover:bg-red-600 text-white font-medium transition-colors
            "
          >
            <AlertTriangle className="w-4 h-4" />
            Send Alert
          </button>
          <button
            onClick={testEmailConfiguration}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors
            "
          >
            <Send className="w-4 h-4" />
            Test Email
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-[#B4D4E1] hover:bg-[#a0c4d1] dark:bg-[#6a8a9a] dark:hover:bg-[#5a7a8a]
              text-white font-medium transition-colors
            "
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5]">
                Send Emergency Alert
              </h3>
            </div>

            <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-4">
              This will notify your emergency contacts that you need support. 
              Only contacts with email addresses and alerts enabled will be notified.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Message (Optional)
              </label>
              <textarea
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                placeholder="I need support right now. Please check on me when you can."
                rows={3}
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-red-500 resize-none
                "
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5] mb-2">
                Will notify:
              </p>
              <div className="space-y-1">
                {contacts.filter(c => c.canReceiveAlerts && c.email).map(contact => (
                  <div key={contact.id} className="text-sm text-[#4A4A4A] dark:text-[#e5e5e5]">
                    • {contact.name} ({contact.relationship})
                  </div>
                ))}
                {contacts.filter(c => c.canReceiveAlerts && c.email).length === 0 && (
                  <p className="text-sm text-red-500">
                    No contacts available for alerts. Add email addresses to enable alerts.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={sendEmergencyAlert}
                disabled={contacts.filter(c => c.canReceiveAlerts && c.email).length === 0}
                className="
                  flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600
                  text-white font-medium transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Send Alert
              </button>
              <button
                onClick={() => setShowEmergencyAlert(false)}
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
        </div>
      )}

      {/* Add/Edit Contact Form */}
      {(showAddForm || editingContact) && (
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl p-6 border border-black/5 dark:border-white/5">
          <h3 className="text-lg font-semibold text-[#4A4A4A] dark:text-[#e5e5e5] mb-4">
            {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Name *
              </label>
              <input
                type="text"
                value={editingContact ? editingContact.name : newContact.name}
                onChange={(e) => editingContact 
                  ? setEditingContact({ ...editingContact, name: e.target.value })
                  : setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="e.g., Mom, Dr. Smith"
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Relationship
              </label>
              <input
                type="text"
                value={editingContact ? editingContact.relationship : newContact.relationship}
                onChange={(e) => editingContact 
                  ? setEditingContact({ ...editingContact, relationship: e.target.value })
                  : setNewContact({ ...newContact, relationship: e.target.value })
                }
                placeholder="e.g., Mother, Friend, Doctor"
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={editingContact ? editingContact.phone : newContact.phone}
                onChange={(e) => editingContact 
                  ? setEditingContact({ ...editingContact, phone: e.target.value })
                  : setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="e.g., +1 (555) 123-4567"
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Email (for alerts)
              </label>
              <input
                type="email"
                value={editingContact ? editingContact.email : newContact.email}
                onChange={(e) => editingContact 
                  ? setEditingContact({ ...editingContact, email: e.target.value })
                  : setNewContact({ ...newContact, email: e.target.value })
                }
                placeholder="e.g., mom@email.com"
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
                Priority Level
              </label>
              <select
                value={editingContact ? editingContact.priority : newContact.priority}
                onChange={(e) => editingContact 
                  ? setEditingContact({ ...editingContact, priority: Number(e.target.value) })
                  : setNewContact({ ...newContact, priority: Number(e.target.value) })
                }
                className="
                  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-[#1a1a1a] text-[#4A4A4A] dark:text-[#e5e5e5]
                  focus:outline-none focus:ring-2 focus:ring-[#B4D4E1]
                "
              >
                <option value={1}>Critical (1)</option>
                <option value={2}>High (2)</option>
                <option value={3}>Medium (3)</option>
                <option value={4}>Low (4)</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingContact ? editingContact.canReceiveAlerts : newContact.canReceiveAlerts}
                  onChange={(e) => editingContact 
                    ? setEditingContact({ ...editingContact, canReceiveAlerts: e.target.checked })
                    : setNewContact({ ...newContact, canReceiveAlerts: e.target.checked })
                  }
                  className="w-4 h-4 text-[#B4D4E1] rounded focus:ring-[#B4D4E1]"
                />
                <span className="text-sm text-[#4A4A4A] dark:text-[#e5e5e5]">
                  Can receive emergency alerts
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={editingContact ? updateContact : addContact}
              disabled={editingContact 
                ? !editingContact.name || !editingContact.phone
                : !newContact.name || !newContact.phone
              }
              className="
                flex-1 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
                text-white font-medium transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingContact(null);
                setNewContact({
                  name: '',
                  relationship: '',
                  phone: '',
                  email: '',
                  canReceiveAlerts: true,
                  priority: 3
                });
              }}
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

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((contact) => {
          const isDefault = DEFAULT_CONTACTS.find(c => c.id === contact.id);
          const priorityColor = getPriorityColor(contact.priority);
          
          return (
            <div
              key={contact.id}
              className="bg-white dark:bg-[#2a2a2a] rounded-xl p-4 border border-black/5 dark:border-white/5"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${priorityColor}20` }}
                >
                  {isDefault ? (
                    <Shield className="w-6 h-6" style={{ color: priorityColor }} />
                  ) : (
                    <Heart className="w-6 h-6" style={{ color: priorityColor }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[#4A4A4A] dark:text-[#e5e5e5] flex items-center gap-2">
                        {contact.name}
                        {contact.priority === 1 && <Star className="w-4 h-4 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                        {contact.relationship}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: priorityColor }}
                      >
                        {getPriorityLabel(contact.priority)}
                      </span>
                      
                      {!isDefault && (
                        <>
                          <button
                            onClick={() => setEditingContact(contact)}
                            className="p-1 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-[#B4D4E1] transition-colors"
                            title="Edit contact"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="p-1 text-[#6B6B6B] dark:text-[#b5b5b5] hover:text-red-500 transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => callContact(contact.phone)}
                      className="
                        flex items-center gap-2 px-4 py-2 rounded-lg
                        bg-green-500 hover:bg-green-600 text-white font-medium transition-colors
                      "
                    >
                      <Phone className="w-4 h-4" />
                      Call {contact.phone}
                    </button>
                    
                    {contact.email && (
                      <span className="text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                        📧 {contact.email}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#6B6B6B] dark:text-[#b5b5b5]">
                    {contact.canReceiveAlerts ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Send className="w-3 h-3" />
                        Can receive alerts
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        No alerts
                      </span>
                    )}
                    
                    {isDefault && (
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Professional support
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {contacts.filter(c => !DEFAULT_CONTACTS.find(dc => dc.id === c.id)).length === 0 && (
        <div className="text-center py-12">
          <Phone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#4A4A4A] dark:text-[#e5e5e5] mb-2">
            Add Your Support Network
          </h3>
          <p className="text-[#6B6B6B] dark:text-[#b5b5b5] mb-4">
            Add family members, friends, or healthcare providers who can support you in emergencies.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="
              px-6 py-3 rounded-lg bg-[#B4D4E1] hover:bg-[#a0c4d1]
              text-white font-medium transition-colors
            "
          >
            Add First Contact
          </button>
        </div>
      )}
    </div>
  );
}