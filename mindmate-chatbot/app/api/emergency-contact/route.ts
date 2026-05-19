import { NextRequest, NextResponse } from 'next/server';
import { emergencyContactService, EmergencyContact, CrisisIncident } from '@/utils/emergencyContactService';
import { emailService } from '@/utils/emailService';

interface EmergencyContactRequest {
  action: 'call' | 'sms' | 'email' | 'auto-email';
  contactIds: string[];
  crisisData: {
    severity: 'critical' | 'high' | 'medium';
    detectedKeywords: string[];
    timestamp: string;
    conversationContext?: string;
    userLocation?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
  };
  sessionId: string;
  customMessage?: string;
  customContacts?: EmergencyContact[];
}

// Email sending function for emergency contacts
async function sendEmergencyEmails(
  contacts: EmergencyContact[], 
  crisisData: Partial<CrisisIncident>,
  customMessage?: string
): Promise<{ contactId: string; success: boolean; method: 'email'; timestamp: Date; error?: string }[]> {
  const results: { contactId: string; success: boolean; method: 'email'; timestamp: Date; error?: string }[] = [];
  
  for (const contact of contacts) {
    try {
      const location = crisisData.userLocation 
        ? `Latitude: ${crisisData.userLocation.latitude}, Longitude: ${crisisData.userLocation.longitude}, Accuracy: ${crisisData.userLocation.accuracy}m`
        : 'Location: Not available (user may have denied location access)';
      
      const isManualAlert = customMessage && crisisData.detectedKeywords?.includes('manual emergency alert');
      const alertType = isManualAlert ? 'MANUAL EMERGENCY ALERT' : 'CRISIS ALERT - IMMEDIATE ATTENTION REQUIRED';
      const alertDescription = isManualAlert 
        ? 'This is a manual emergency alert sent by a MindMate user.'
        : 'This is an automated emergency alert from the MindMate mental health support system.';

      const emailContent = {
        to: contact.email,
        subject: `URGENT: ${alertType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #fee; border-left: 4px solid #f44; padding: 20px; margin-bottom: 20px;">
              <h1 style="color: #d33; margin: 0 0 10px 0;">🚨 ${alertType}</h1>
              <p style="margin: 0; font-weight: bold;">${alertDescription}</p>
            </div>
            
            ${customMessage ? `
            <div style="padding: 20px; background-color: #e8f4fd; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1565c0; margin-top: 0;">Personal Message</h3>
              <p style="font-size: 16px; line-height: 1.6; margin: 0; font-style: italic;">"${customMessage}"</p>
            </div>
            ` : ''}
            
            <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Incident Details</h2>
              <ul style="line-height: 1.6;">
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Severity Level:</strong> ${crisisData.severity?.toUpperCase()}</li>
                <li><strong>Alert Type:</strong> ${isManualAlert ? 'Manual Alert' : 'Automated Detection'}</li>
                ${!isManualAlert ? `<li><strong>Detected Keywords:</strong> ${crisisData.detectedKeywords?.join(', ') || 'Not specified'}</li>` : ''}
                <li><strong>User Location:</strong> ${location}</li>
              </ul>
            </div>
            
            <div style="padding: 20px; background-color: #fff3cd; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #856404; margin-top: 0;">Immediate Action Required</h3>
              <p>A user of the MindMate mental health support system needs your help. Please:</p>
              <ol style="line-height: 1.6;">
                <li><strong>Reach out to this person immediately</strong> using the contact information you have on file</li>
                <li><strong>If you cannot reach them within 15 minutes</strong>, please consider contacting emergency services</li>
                <li><strong>Stay with them</strong> until professional help arrives if needed</li>
              </ol>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              <p>This is an alert from the MindMate safety system. If you believe this alert was sent in error, please contact our support team.</p>
              <p>Emergency Services: 911 | Crisis Text Line: Text HOME to 741741</p>
            </div>
          </div>
        `
      };
      
      const success = await emailService.sendEmail(emailContent);
      
      results.push({
        contactId: contact.id,
        success,
        method: 'email',
        timestamp: new Date(),
        error: success ? undefined : 'Email service unavailable'
      });
    } catch (error) {
      results.push({
        contactId: contact.id,
        success: false,
        method: 'email',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

// Mock emergency contacts - in production, these would come from user settings or database
const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact_1',
    name: 'Emergency Contact 1',
    number: '',
    email: '',
    description: 'Primary emergency contact'
  },
  {
    id: 'contact_2',
    name: 'Emergency Contact 2',
    number: '',
    email: '',
    description: 'Secondary emergency contact'
  },
  {
    id: 'crisis_hotline',
    name: 'Crisis Hotline',
    number: '988',
    email: '',
    description: 'National Crisis Hotline'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: EmergencyContactRequest = await request.json();
    
    if (!body.action || !body.sessionId || !body.crisisData) {
      return NextResponse.json(
        { error: 'Action, sessionId, and crisisData are required' },
        { status: 400 }
      );
    }

    // Get contacts (use custom contacts if provided, otherwise use mock contacts)
    const contacts = body.customContacts && body.customContacts.length > 0
      ? body.customContacts
      : body.contactIds.length > 0 
        ? MOCK_EMERGENCY_CONTACTS.filter(c => body.contactIds.includes(c.id))
        : MOCK_EMERGENCY_CONTACTS;

    let results: any[] = [];
    let actionsTaken: string[] = [];

    // Create incident record
    const incidentData: Omit<CrisisIncident, 'id'> = {
      sessionId: body.sessionId,
      timestamp: new Date(body.crisisData.timestamp),
      severity: body.crisisData.severity,
      detectedKeywords: body.crisisData.detectedKeywords,
      actionsTaken: [],
      contactsReached: [],
      resolved: false,
      userLocation: body.crisisData.userLocation
    };

    switch (body.action) {
      case 'call':
        if (contacts.length > 0) {
          const success = await emergencyContactService.initiateCall(contacts[0]);
          results.push({
            contactId: contacts[0].id,
            success,
            method: 'call',
            timestamp: new Date()
          });
          if (success) {
            actionsTaken.push('call_made');
            incidentData.contactsReached.push(contacts[0].id);
          }
        }
        break;

      case 'sms':
        results = await emergencyContactService.sendSMS(contacts, incidentData);
        actionsTaken.push('sms_sent');
        incidentData.contactsReached = results
          .filter(r => r.success)
          .map(r => r.contactId);
        break;

      case 'email':
      case 'auto-email':
        // Handle email sending directly in the API route
        results = await sendEmergencyEmails(contacts, incidentData, body.customMessage);
        actionsTaken.push(body.action === 'auto-email' ? 'auto_email_sent' : 'email_sent');
        incidentData.contactsReached = results
          .filter(r => r.success)
          .map(r => r.contactId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update incident with actions taken
    incidentData.actionsTaken = actionsTaken as any;
    
    // Log the incident
    const incidentId = await emergencyContactService.logIncident(incidentData);

    const response = {
      success: results.some(r => r.success),
      contactsReached: results.filter(r => r.success).map(r => r.contactId),
      failedContacts: results.filter(r => !r.success).map(r => r.contactId),
      incidentId,
      results
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Emergency contact error:', error);
    return NextResponse.json(
      { 
        error: 'Emergency contact service failed',
        success: false,
        contactsReached: [],
        failedContacts: [],
        incidentId: null
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available emergency contacts (in production, this would be user-specific)
  return NextResponse.json({
    contacts: MOCK_EMERGENCY_CONTACTS.map(contact => ({
      id: contact.id,
      name: contact.name,
      description: contact.description
      // Don't expose phone/email in GET requests for security
    }))
  });
}