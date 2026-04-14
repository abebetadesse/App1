import sgMail from '@sendgrid/mail';

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.enabled = true;
    } else {
      this.enabled = false;
      console.warn('SendGrid API key not configured - email service disabled');
    }
  }

  /**
   * Send email
   */
  async sendEmail(emailData) {
    if (!this.enabled) {
      console.warn('Email service disabled - skipping email send');
      return { success: false, error: 'Email service disabled' };
    }

    try {
      const msg = {
        to: emailData.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thamplatform.com',
        subject: emailData.subject,
        html: this.generateEmailTemplate(emailData.template, emailData.data),
        ...(emailData.templateId && { templateId: emailData.templateId })
      };

      await sgMail.send(msg);
      
      console.log(`Email sent successfully to: ${emailData.to}`);
      return { success: true };
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate email template
   */
  generateEmailTemplate(template, data) {
    const templates = {
      welcome: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Tham Platform!</h1>
            </div>
            <div class="content">
              <p>Hello ${data.name},</p>
              <p>Welcome to Tham Platform! Your account has been successfully created as a ${data.role}.</p>
              <p>You can now login to your account and start using our platform.</p>
              <p><a href="${data.loginUrl}">Login to Your Account</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Tham Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      'password-reset': `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${data.name},</p>
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
              </p>
              <p>This link will expire in ${data.expiryTime}.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Tham Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return templates[template] || '<p>Email content not available</p>';
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export the sendEmail function directly
export {
sendEmail: (emailData) => emailService.sendEmail(emailData)
};