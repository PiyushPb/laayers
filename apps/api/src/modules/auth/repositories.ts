import { db } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import {
  users,
  authSessions,
  authCodes,
  emailVerifications,
  passwordResets,
  userConsents,
  loginAttempts,
  oauthAccounts
} from '@layers/database/src/schema';

export const AuthRepository = {
  // Users
  async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  },

  async getUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  },

  async createUser(data: typeof users.$inferInsert) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  },

  // OAuth Accounts
  async getOAuthAccount(provider: string, providerUserId: string) {
    const result = await db
      .select()
      .from(oauthAccounts)
      .where(and(eq(oauthAccounts.provider, provider), eq(oauthAccounts.providerUserId, providerUserId)))
      .limit(1);
    return result[0];
  },

  async createOAuthAccount(data: typeof oauthAccounts.$inferInsert) {
    const result = await db.insert(oauthAccounts).values(data).returning();
    return result[0];
  },

  // Sessions
  async createSession(data: typeof authSessions.$inferInsert) {
    const result = await db.insert(authSessions).values(data).returning();
    return result[0];
  },

  async getSessionByRefreshTokenHash(hash: string) {
    const result = await db.select().from(authSessions).where(eq(authSessions.refreshTokenHash, hash)).limit(1);
    return result[0];
  },

  async getSessionBySessionTokenHash(hash: string) {
    const result = await db.select().from(authSessions).where(eq(authSessions.sessionTokenHash, hash)).limit(1);
    return result[0];
  },

  async updateSession(id: string, data: Partial<typeof authSessions.$inferInsert>) {
    const result = await db.update(authSessions).set(data).where(eq(authSessions.id, id)).returning();
    return result[0];
  },

  async deleteSession(id: string) {
    await db.delete(authSessions).where(eq(authSessions.id, id));
  },

  async revokeAllSessions(userId: string) {
    await db.update(authSessions).set({ revokedAt: new Date() }).where(eq(authSessions.userId, userId));
  },

  async getUserSessions(userId: string) {
    return await db.select().from(authSessions).where(eq(authSessions.userId, userId));
  },

  // Auth Codes
  async createAuthCode(data: typeof authCodes.$inferInsert) {
    const result = await db.insert(authCodes).values(data).returning();
    return result[0];
  },

  async getAuthCodeByHash(hash: string) {
    const result = await db.select().from(authCodes).where(eq(authCodes.codeHash, hash)).limit(1);
    return result[0];
  },

  async consumeAuthCode(id: string) {
    const result = await db.update(authCodes).set({ consumedAt: new Date() }).where(eq(authCodes.id, id)).returning();
    return result[0];
  },

  // Email Verifications
  async createEmailVerification(data: typeof emailVerifications.$inferInsert) {
    const result = await db.insert(emailVerifications).values(data).returning();
    return result[0];
  },

  async getEmailVerificationByHash(hash: string) {
    const result = await db.select().from(emailVerifications).where(eq(emailVerifications.tokenHash, hash)).limit(1);
    return result[0];
  },

  async deleteEmailVerification(id: string) {
    await db.delete(emailVerifications).where(eq(emailVerifications.id, id));
  },

  // Password Resets
  async createPasswordReset(data: typeof passwordResets.$inferInsert) {
    const result = await db.insert(passwordResets).values(data).returning();
    return result[0];
  },

  async getPasswordResetByHash(hash: string) {
    const result = await db.select().from(passwordResets).where(eq(passwordResets.tokenHash, hash)).limit(1);
    return result[0];
  },

  async consumePasswordReset(id: string) {
    const result = await db.update(passwordResets).set({ usedAt: new Date() }).where(eq(passwordResets.id, id)).returning();
    return result[0];
  },

  // User Consents
  async createConsent(data: typeof userConsents.$inferInsert) {
    const result = await db.insert(userConsents).values(data).returning();
    return result[0];
  },

  async getConsentsForUser(userId: string) {
    return await db.select().from(userConsents).where(eq(userConsents.userId, userId));
  },

  // Login Attempts
  async createLoginAttempt(data: typeof loginAttempts.$inferInsert) {
    await db.insert(loginAttempts).values(data);
  }
};
