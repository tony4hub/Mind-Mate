import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local');
    }

    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    return this.transporter;
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.GMAIL_USER,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendBulkEmails(emails: EmailData[]): Promise<{ success: number; failed: number; results: boolean[] }> {
    const results: boolean[] = [];
    let success = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push(result);
      if (result) {
        success++;
      } else {
        failed++;
      }
      
      // Add a small delay between emails to avoid rate limiting
      if (emails.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success, failed, results };
  }

  async testConnection(): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      await transporter.verify();
      console.log('Gmail connection verified successfully');
      return true;
    } catch (error) {
      console.error('Gmail connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();