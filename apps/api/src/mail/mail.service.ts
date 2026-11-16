import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private fallbackTransporter: nodemailer.Transporter | null = null;
  private readonly senderEmail =
    process.env.GMAIL_USER ||
    process.env.EMAIL_USER ||
    process.env.MAIL_FROM_ADDRESS ||
    'kavimkumarm6383@gmail.com';
  private readonly senderName = process.env.MAIL_FROM_NAME || 'Zuno ERP Security';

  constructor() {
    this.initTransporters();
  }

  private initTransporters() {
    const rawPass =
      process.env.GMAIL_APP_PASSWORD ||
      process.env.SMTP_PASS ||
      process.env.EMAIL_PASSWORD ||
      process.env.EMAIL_PASS ||
      'zuvrttbhikhbwilk';
    const password = rawPass.replace(/\s+/g, '');

    if (password) {
      // Primary: Direct SSL port 465 with short timeouts (works reliably in cloud hosting & localhost)
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: this.senderEmail,
          pass: password,
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 10000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Secondary: Standard service: 'gmail' (port 587 STARTTLS) with fast timeout
      this.fallbackTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.senderEmail,
          pass: password,
        },
        connectionTimeout: 7000,
        greetingTimeout: 7000,
        socketTimeout: 10000,
      });

      this.logger.log(`Initialized primary SSL (port 465) & fallback Gmail transporters for ${this.senderEmail}`);
    } else {
      this.logger.warn(`GMAIL_APP_PASSWORD not set. Real emails from ${this.senderEmail} require a Google App Password.`);
    }
  }

  /**
   * Generic sendEmail method matching user specification:
   * async function sendEmail(to, subject, message)
   * NEVER returns fake success — throws on delivery failure so callers know the true outcome.
   */
  async sendEmail(to: string, subject: string, message: string): Promise<{ success: boolean; messageId: string }> {
    const fromAddress = `"${this.senderName}" <${this.senderEmail}>`;

    if (!this.transporter) {
      const err = new Error('Email transporter is not initialized. Please verify GMAIL_USER and GMAIL_APP_PASSWORD.');
      this.logger.error(err.message);
      throw err;
    }

    // Attempt 1: Direct SSL port 465 transporter
    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html: message,
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (primaryError: any) {
      this.logger.warn(`Primary SSL transport notice: ${primaryError.message}. Attempting secondary fallback transport...`);

      // Attempt 2: Secondary Gmail service transport
      if (this.fallbackTransporter) {
        try {
          const info = await this.fallbackTransporter.sendMail({
            from: fromAddress,
            to,
            subject,
            html: message,
          });
          this.logger.log(`Fallback email sent successfully: ${info.messageId}`);
          return {
            success: true,
            messageId: info.messageId,
          };
        } catch (secondaryError: any) {
          this.logger.error(`Fallback transport notice: ${secondaryError.message}`);
        }
      }

      // If both fail, THROW the error so caller knows email was NOT sent
      const reason = primaryError?.message || 'SMTP connection timed out';
      const failureMsg = `Failed to deliver email to ${to}: ${reason}. Cloud hosting firewalls (e.g. Render Free tier) may block outbound SMTP ports (465/587).`;
      this.logger.error(failureMsg);
      throw new Error(failureMsg);
    }
  }

  /**
   * Send genuine 6-digit OTP email to recipient
   * Propagates errors on delivery failure — NEVER returns fake success.
   */
  async sendOtpEmail(toEmail: string, otpCode: string, purpose = 'Verification'): Promise<{ success: boolean; message: string; messageId?: string }> {
    const subject = `[Zuno ERP] Your ${purpose} Verification Code: ${otpCode}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 32px 24px; }
          .otp-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .otp-label { font-size: 12px; text-transform: uppercase; font-weight: 600; color: #15803d; letter-spacing: 1px; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #166534; letter-spacing: 8px; margin: 12px 0; }
          .otp-valid { font-size: 12px; color: #64748b; }
          .security-note { font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZUNO ERP Enterprise</h1>
            <p>Cloud Business Operations & Security</p>
          </div>
          <div class="body">
            <h2 style="font-size: 18px; margin: 0 0 8px; color: #0f172a;">${purpose} Verification</h2>
            <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.5;">
              We received a request to verify your corporate identity for account <strong>${toEmail}</strong>. Use the 6-digit code below to proceed:
            </p>
            <div class="otp-card">
              <div class="otp-label">One-Time Verification Passcode</div>
              <div class="otp-code">${otpCode}</div>
              <div class="otp-valid">Valid for 10 minutes &bull; Do not share this code</div>
            </div>
            <div class="security-note">
              <strong>Security Alert:</strong> If you did not initiate this request, your password may need immediate review. Please contact your company administrator.
            </div>
          </div>
          <div class="footer">
            Sent by ZUNO ERP Multi-Tenant Security Engine from ${this.senderEmail}<br/>
            &copy; ${new Date().getFullYear()} ZUNO Enterprise SaaS. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Strictly deliver email. If sending fails, throw error so caller knows OTP was NOT delivered
    const result = await this.sendEmail(toEmail, subject, htmlContent);

    return {
      success: true,
      message: `Verification code successfully sent to ${toEmail}`,
      messageId: result.messageId,
    };
  }
}
