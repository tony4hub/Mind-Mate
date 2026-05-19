export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  email: string;
  description: string;
}

export interface CrisisIncident {
  id: string;
  sessionId: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium';
  detectedKeywords: string[];
  actionsTaken: ('modal_shown' | 'call_made' | 'sms_sent' | 'email_sent' | 'auto_email_sent')[];
  contactsReached: string[];
  resolved: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface ContactResult {
  contactId: string;
  success: boolean;
  method: 'sms' | 'email' | 'call';
  timestamp: Date;
  error?: string;
}

export class EmergencyContactService {
  private incidents: Map<string, CrisisIncident> = new Map();

  async sendSMS(
    contacts: EmergencyContact[], 
    crisisData: Partial<CrisisIncident>
  ): Promise<ContactResult[]> {
    const results: ContactResult[] = [];
    
    for (const contact of contacts) {
      try {
        const location = crisisData.userLocation 
          ? `Location: ${crisisData.userLocation.latitude}, ${crisisData.userLocation.longitude}`
          : 'Location: Not available';
        
        const message = `URGENT: Crisis alert for MindMate user. Severity: ${crisisData.severity}. ${location}. Please reach out immediately. Time: ${new Date().toLocaleString()}`;
        
        // In a real implementation, you would use Twilio or similar service
        const success = await this.sendSMSMessage(contact.number, message);
        
        results.push({
          contactId: contact.id,
          success,
          method: 'sms',
          timestamp: new Date(),
          error: success ? undefined : 'SMS service unavailable'
        });
      } catch (error) {
        results.push({
          contactId: contact.id,
          success: false,
          method: 'sms',
          timestamp: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  async sendEmail(
    contacts: EmergencyContact[], 
    crisisData: Partial<CrisisIncident>,
    customMessage?: string
  ): Promise<ContactResult[]> {
    const results: ContactResult[] = [];
    
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
        
        // In a real implementation, you would use SendGrid, AWS SES, or similar service
        const success = await this.sendEmailMessage(emailContent);
        
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

  async initiateCall(contact: EmergencyContact): Promise<boolean> {
    try {
      // In a real implementation, this would use Twilio Voice API or similar
      // For now, we'll open the phone dialer
      if (typeof window !== 'undefined') {
        window.open(`tel:${contact.number}`, '_self');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initiating call:', error);
      return false;
    }
  }

  async logIncident(incident: Omit<CrisisIncident, 'id'>): Promise<string> {
    const incidentId = `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullIncident: CrisisIncident = {
      ...incident,
      id: incidentId
    };
    
    this.incidents.set(incidentId, fullIncident);
    
    // In a real implementation, this would be stored in a database
    console.log(`Crisis incident logged: ${incidentId}`, {
      severity: incident.severity,
      timestamp: incident.timestamp,
      keywordCount: incident.detectedKeywords.length,
      actionsTaken: incident.actionsTaken,
      contactsReached: incident.contactsReached.length
      // Note: No personal details logged for privacy
    });
    
    return incidentId;
  }

  getIncident(incidentId: string): CrisisIncident | undefined {
    return this.incidents.get(incidentId);
  }

  // Mock implementations for SMS and Email services
  private async sendSMSMessage(phoneNumber: string, message: string): Promise<boolean> {
    // In production, integrate with Twilio:
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });
    
    console.log(`SMS would be sent to ${phoneNumber}: ${message}`);
    return true; // Mock success
  }

  private async sendEmailMessage(emailData: any): Promise<boolean> {
    // This method is now just a placeholder - actual email sending happens in the API route
    console.log(`Email would be sent to ${emailData.to}: ${emailData.subject}`);
    return true; // Mock success - real sending happens server-side
  }

  async getUserLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Location access denied or failed:', error);
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }
}

// Export singleton instance
export const emergencyContactService = new EmergencyContactService();