import nodemailer from 'nodemailer';
import { logger } from '@layers/logger';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static async getTransporter() {
    if (this.transporter) return this.transporter;

    if (process.env.NODE_ENV === 'production') {
      // In production, configure with real SMTP provider
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info('📧 Ethereal Email account configured for development');
    }
    
    return this.transporter;
  }

  static async sendEmail(to: string, subject: string, html: string) {
    const transporter = await this.getTransporter();
    
    const info = await transporter.sendMail({
      from: '"Layers" <noreply@layers.com>',
      to,
      subject,
      html,
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.info(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  }

  static async sendPasswordReset(email: string, token: string) {
    // In a real app, this URL would point to your frontend application
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    
    await this.sendEmail(
      email,
      'Password Reset Request',
      `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. The link is valid for 1 hour.</p>`
    );
  }

  static async sendEmailVerification(email: string, token: string) {
    const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;
    
    await this.sendEmail(
      email,
      'Verify Your Email',
      `<p>Welcome to Layers!</p><p>Please verify your email address by clicking <a href="${verifyUrl}">here</a>.</p>`
    );
  }

  static async sendWorkspaceInvitation(email: string, workspaceName: string, token: string) {
    const inviteUrl = `http://localhost:3000/invitations/${token}`;

    await this.sendEmail(
      email,
      `You've been invited to join ${workspaceName}`,
      `<p>You have been invited to join the workspace <strong>${workspaceName}</strong> on Layers.</p><p>Click <a href="${inviteUrl}">here</a> to accept the invitation.</p>`
    );
  }
}
