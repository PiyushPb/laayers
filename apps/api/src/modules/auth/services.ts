import { AppError, UnauthorizedError, ValidationError, NotFoundError } from '@layers/shared';
import { AuthRepository } from './repositories';
import { CryptoUtils } from './utils/crypto';
import { z } from 'zod';
import { signupSchema, loginSchema, exchangeCodeSchema } from './schemas';
import { db, users, userConsents, workspaces, workspaceMembers } from '@layers/database';
import { eq } from 'drizzle-orm';

const SESSION_EXPIRY_DAYS = 30;
const AUTH_CODE_EXPIRY_MINUTES = 1;

interface ClientMeta {
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const AuthService = {
  async signup(payload: z.infer<typeof signupSchema>, clientMeta: ClientMeta) {
    const passwordHash = await CryptoUtils.hashPassword(payload.password);

    const user = await db.transaction(async (tx) => {
      const existingUser = await tx.select().from(users).where(eq(users.email, payload.email)).limit(1);
      if (existingUser.length > 0) {
        throw new AppError('Email already in use', 400, 'EMAIL_IN_USE');
      }

      const [newUser] = await tx.insert(users).values({
        email: payload.email,
        passwordHash,
        name: payload.name,
        marketingEmailsEnabled: payload.marketingEmailsEnabled,
        status: 'active',
      }).returning();

      if (payload.consents && payload.consents.length > 0) {
        await tx.insert(userConsents).values(
          payload.consents.map((c) => ({
            userId: newUser.id,
            consentType: c.consentType,
            version: c.version,
            ipAddress: clientMeta.ipAddress,
            userAgent: clientMeta.userAgent,
          }))
        );
      }

      const baseSlug = generateSlug(payload.workspaceName) || 'workspace';
      let slug = baseSlug;
      while (true) {
        const existing = await tx.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
        if (existing.length === 0) {
          break;
        }
        slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const [workspace] = await tx.insert(workspaces).values({
        ownerId: newUser.id,
        name: payload.workspaceName,
        slug,
      }).returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: newUser.id,
        role: 'owner',
      });

      return newUser;
    });

    // Create session
    return this.createSession(user.id, clientMeta);
  },

  async login(payload: z.infer<typeof loginSchema>, clientMeta: ClientMeta) {
    const user = await AuthRepository.getUserByEmail(payload.email);
    
    if (!user || !user.passwordHash) {
      await AuthRepository.createLoginAttempt({ email: payload.email, ipAddress: clientMeta.ipAddress, success: false, failureReason: 'invalid_credentials' });
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'suspended') {
      await AuthRepository.createLoginAttempt({ email: payload.email, ipAddress: clientMeta.ipAddress, success: false, failureReason: 'account_suspended' });
      throw new UnauthorizedError('Account is suspended');
    }

    if (user.deletedAt) {
      await AuthRepository.createLoginAttempt({ email: payload.email, ipAddress: clientMeta.ipAddress, success: false, failureReason: 'account_deleted' });
      throw new UnauthorizedError('Account is deleted');
    }

    const isValid = await CryptoUtils.verifyPassword(user.passwordHash, payload.password);
    if (!isValid) {
      await AuthRepository.createLoginAttempt({ email: payload.email, ipAddress: clientMeta.ipAddress, success: false, failureReason: 'invalid_credentials' });
      throw new UnauthorizedError('Invalid email or password');
    }

    await AuthRepository.createLoginAttempt({ email: payload.email, ipAddress: clientMeta.ipAddress, success: true });
    await AuthRepository.updateUser(user.id, { lastLoginAt: new Date() });

    return this.createSession(user.id, clientMeta);
  },

  async createSession(userId: string, meta: ClientMeta) {
    const sessionToken = CryptoUtils.generateSecureToken();
    const refreshToken = CryptoUtils.generateSecureToken();

    const sessionTokenHash = CryptoUtils.hashToken(sessionToken);
    const refreshTokenHash = CryptoUtils.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

    await AuthRepository.createSession({
      userId,
      sessionTokenHash,
      refreshTokenHash,
      expiresAt,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceId: meta.deviceId,
      deviceName: meta.deviceName,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
    });

    return { sessionToken, refreshToken, expiresAt };
  },

  async refreshSession(refreshToken: string, meta: ClientMeta) {
    const hash = CryptoUtils.hashToken(refreshToken);
    const session = await AuthRepository.getSessionByRefreshTokenHash(hash);

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await AuthRepository.deleteSession(session.id);
    return this.createSession(session.userId, meta);
  },

  async logout(sessionToken: string) {
    const hash = CryptoUtils.hashToken(sessionToken);
    const session = await AuthRepository.getSessionBySessionTokenHash(hash);
    if (session) {
      await AuthRepository.deleteSession(session.id);
    }
  },

  async generateAuthCode(userId: string, clientId: string, redirectUri: string) {
    const code = CryptoUtils.generateSecureToken(32);
    const codeHash = CryptoUtils.hashToken(code);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + AUTH_CODE_EXPIRY_MINUTES);

    await AuthRepository.createAuthCode({
      userId,
      codeHash,
      clientId,
      redirectUri,
      expiresAt,
    });

    return { code };
  },

  async exchangeAuthCode(payload: z.infer<typeof exchangeCodeSchema>) {
    const hash = CryptoUtils.hashToken(payload.code);
    const authCode = await AuthRepository.getAuthCodeByHash(hash);

    if (!authCode || authCode.consumedAt || authCode.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired authorization code');
    }

    if (authCode.clientId !== payload.clientId || authCode.redirectUri !== payload.redirectUri) {
      throw new UnauthorizedError('Client ID or Redirect URI mismatch');
    }

    await AuthRepository.consumeAuthCode(authCode.id);

    const user = await AuthRepository.getUserById(authCode.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  },

  async validateSession(sessionToken: string) {
    const hash = CryptoUtils.hashToken(sessionToken);
    const session = await AuthRepository.getSessionBySessionTokenHash(hash);

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return null;
    }

    await AuthRepository.updateSession(session.id, { lastActiveAt: new Date() });

    const user = await AuthRepository.getUserById(session.userId);
    return { session, user };
  },

  async requestPasswordReset(email: string) {
    const user = await AuthRepository.getUserByEmail(email);
    if (!user) return; // Prevent user enumeration

    const token = CryptoUtils.generateSecureToken();
    const tokenHash = CryptoUtils.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await AuthRepository.createPasswordReset({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // TODO: Send email
  },

  async resetPassword(payload: z.infer<typeof import('./schemas').resetPasswordSchema>) {
    const hash = CryptoUtils.hashToken(payload.token);
    const resetRecord = await AuthRepository.getPasswordResetByHash(hash);

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const passwordHash = await CryptoUtils.hashPassword(payload.password);
    
    await AuthRepository.updateUser(resetRecord.userId, { passwordHash });
    await AuthRepository.consumePasswordReset(resetRecord.id);
    await AuthRepository.revokeAllSessions(resetRecord.userId);
  },

  async verifyEmail(payload: z.infer<typeof import('./schemas').verifyEmailSchema>) {
    const hash = CryptoUtils.hashToken(payload.token);
    const verifyRecord = await AuthRepository.getEmailVerificationByHash(hash);

    if (!verifyRecord || verifyRecord.verifiedAt || verifyRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired verification token');
    }

    await AuthRepository.updateUser(verifyRecord.userId, { emailVerifiedAt: new Date() });
    await AuthRepository.deleteEmailVerification(verifyRecord.id);
  },

  async resendVerification(email: string) {
    const user = await AuthRepository.getUserByEmail(email);
    if (!user || user.emailVerifiedAt) return; // Prevent enumeration and resending to verified

    const token = CryptoUtils.generateSecureToken();
    const tokenHash = CryptoUtils.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await AuthRepository.createEmailVerification({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // TODO: Send email
  },

  async revokeSession(userId: string, sessionId: string) {
    const session = await AuthRepository.getSessionBySessionTokenHash(sessionId);
    if (session && session.userId === userId) {
      await AuthRepository.deleteSession(session.id);
    }
  },

  async revokeAllSessions(userId: string) {
    await AuthRepository.revokeAllSessions(userId);
  },

  async getUserSessions(userId: string) {
    return AuthRepository.getUserSessions(userId);
  },

  async getUserConsents(userId: string) {
    return AuthRepository.getConsentsForUser(userId);
  },

  async addUserConsent(userId: string, payload: z.infer<typeof import('./schemas').consentSchema>, meta: ClientMeta) {
    return AuthRepository.createConsent({
      userId,
      consentType: payload.consentType,
      version: payload.version,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }
};
