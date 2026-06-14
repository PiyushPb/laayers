import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes';
import { AuthService } from '../services';
import { errorHandler } from '../../../middlewares/errorHandler';
import { AppError, UnauthorizedError } from '@layers/shared';

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use(errorHandler);

// Mock the AuthService to avoid database interaction
vi.mock('../services', () => ({
  AuthService: {
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    generateAuthCode: vi.fn(),
    exchangeAuthCode: vi.fn(),
    validateSession: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
    getUserSessions: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllSessions: vi.fn(),
  }
}));

describe('Auth Module Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create a user and return a session', async () => {
      vi.mocked(AuthService.signup).mockResolvedValue({
        sessionToken: 'session-1',
        refreshToken: 'refresh-1',
        expiresAt: new Date(Date.now() + 100000),
      });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          workspaceName: 'Test Workspace',
          marketingEmailsEnabled: true,
          consents: [{ consentType: 'terms', version: 'v1.0' }],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should prevent duplicate signup', async () => {
      vi.mocked(AuthService.signup).mockRejectedValue(new AppError('Email already in use', 400, 'EMAIL_IN_USE'));

      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          workspaceName: 'Test Workspace',
          marketingEmailsEnabled: true,
          consents: [{ consentType: 'terms', version: 'v1.0' }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_IN_USE');
    });

    it('should fail validation with missing required fields', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should reject invalid credentials (wrong email/password)', async () => {
      vi.mocked(AuthService.login).mockRejectedValue(new UnauthorizedError('Invalid email or password'));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject suspended account', async () => {
      vi.mocked(AuthService.login).mockRejectedValue(new UnauthorizedError('Account is suspended'));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Account is suspended');
    });

    it('should reject deleted account', async () => {
      vi.mocked(AuthService.login).mockRejectedValue(new UnauthorizedError('Account is deleted'));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Account is deleted');
    });
  });

  describe('POST /auth/exchange-code', () => {
    it('should exchange a valid authorization code', async () => {
      vi.mocked(AuthService.exchangeAuthCode).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        status: 'active',
        emailVerifiedAt: new Date(),
      });

      const res = await request(app)
        .post('/auth/exchange-code')
        .send({ 
          code: 'valid-code', 
          clientId: 'client-1', 
          redirectUri: 'http://localhost/callback' 
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.identity.email).toBe('test@example.com');
    });

    it('should reject expired authorization code', async () => {
      vi.mocked(AuthService.exchangeAuthCode).mockRejectedValue(new UnauthorizedError('Invalid or expired authorization code'));

      const res = await request(app)
        .post('/auth/exchange-code')
        .send({ 
          code: 'expired-code', 
          clientId: 'client-1', 
          redirectUri: 'http://localhost/callback' 
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid or expired authorization code');
    });
  });

  describe('Session Management', () => {
    it('should reject requests without a session cookie', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should allow requests with a valid session cookie', async () => {
      vi.mocked(AuthService.validateSession).mockResolvedValue({
        session: {
          id: 'session-1',
          userId: 'user-1',
          expiresAt: new Date(Date.now() + 100000)
        } as any,
        user: {
          id: 'user-1',
          email: 'test@example.com',
          status: 'active',
        } as any,
      });

      const res = await request(app)
        .get('/auth/me')
        .set('Cookie', ['session_token=valid-token']);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });
  });
});
