import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().trim().min(1, 'Name is required'),
  workspaceName: z.string().trim().min(1, 'Workspace name is required'),
  marketingEmailsEnabled: z.boolean().default(false),
  consents: z.array(z.object({
    consentType: z.enum(['terms', 'privacy', 'cookies', 'marketing']),
    version: z.string().min(1, 'Version is required'),
  })).min(1, 'At least one consent is required'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const exchangeCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  redirectUri: z.string().url('Invalid redirect URI'),
});

export const consentSchema = z.object({
  consentType: z.enum(['terms', 'privacy', 'cookies', 'marketing']),
  version: z.string().min(1, 'Version is required'),
});
