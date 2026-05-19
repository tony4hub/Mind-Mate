import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    // Test the connection first
    const connectionTest = await emailService.testConnection();
    if (!connectionTest) {
      return NextResponse.json(
        { 
          error: 'Gmail connection failed. Please check your GMAIL_USER and GMAIL_APP_PASSWORD in .env.local',
          success: false 
        },
        { status: 500 }
      );
    }

    // Send test email
    const success = await emailService.sendEmail({
      to: testEmail,
      subject: 'MindMate Email Test - Configuration Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #e8f5e8; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 20px;">
            <h1 style="color: #2e7d32; margin: 0 0 10px 0;">✅ Email Configuration Test</h1>
            <p style="margin: 0; font-weight: bold;">Your MindMate emergency email system is working correctly!</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Test Details</h2>
            <ul style="line-height: 1.6;">
              <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Test Email:</strong> ${testEmail}</li>
              <li><strong>Status:</strong> Successfully sent</li>
            </ul>
          </div>
          
          <div style="padding: 20px; background-color: #fff3cd; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #856404; margin-top: 0;">What This Means</h3>
            <p>Your emergency contact system is now ready to send real alerts when crisis situations are detected. The system will automatically notify your emergency contacts when needed.</p>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>This is a test email from the MindMate emergency alert system.</p>
          </div>
        </div>
      `
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully'
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          success: false 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Email service error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        success: false 
      },
      { status: 500 }
    );
  }
}