import { db, users, workspaces, workspaceMembers, workspaceSettings, workspaceQuotas, workspaceSdkKeys, workspaceModules, sessions } from '@layers/database';
import { hashPassword, comparePassword, generateRandomToken, hashToken, UnauthorizedError, ValidationError, NotFoundError } from '@layers/shared';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { eq, and, not } from 'drizzle-orm';
import crypto from 'crypto';
import { EmailService } from './email.service';

export class AuthService {
  static async register(data: any) {
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      throw new ValidationError('Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);
    const verifyToken = generateRandomToken();

    // Transaction to create user, workspace, and setup
    const result = await db.transaction(async (tx) => {
      // 1. Create User
      const [user] = await tx.insert(users).values({
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword,
        verifyEmailToken: hashToken(verifyToken),
        verifyEmailExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }).returning();

      // 2. Create Default Workspace
      const [workspace] = await tx.insert(workspaces).values({
        name: `${data.name}'s Workspace`,
        slug: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomBytes(4).toString('hex')}`,
        ownerId: user.id,
      }).returning();

      // 3. Add to Workspace Members
      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner',
      });

      // 4. Create Workspace Settings
      await tx.insert(workspaceSettings).values({
        workspaceId: workspace.id,
      });

      // 5. Create Workspace Quotas
      await tx.insert(workspaceQuotas).values({
        workspaceId: workspace.id,
      });

      // 6. Create SDK Keys
      await tx.insert(workspaceSdkKeys).values({
        workspaceId: workspace.id,
        publicKey: `pk_${crypto.randomBytes(16).toString('hex')}`,
        secretKey: `sk_${crypto.randomBytes(32).toString('hex')}`,
      });

      // 7. Enable Default Modules
      await tx.insert(workspaceModules).values([
        { workspaceId: workspace.id, moduleKey: 'blogs', enabled: true },
        { workspaceId: workspace.id, moduleKey: 'chat', enabled: true },
      ]);

      return { user, workspace };
    });

    // Send verification email asynchronously
    EmailService.sendEmailVerification(data.email, verifyToken).catch(console.error);

    return result;
  }

  static async login(data: any, ipAddress: string, userAgent: string) {
    const userRecords = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    const user = userRecords[0];

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return await this.createSessionAndTokens(user.id, ipAddress, userAgent);
  }

  static async createSessionAndTokens(userId: string, ipAddress: string, userAgent: string) {
    const refreshToken = generateRandomToken();
    const refreshTokenHash = hashToken(refreshToken);

    const [session] = await db.insert(sessions).values({
      userId,
      refreshTokenHash,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }).returning();

    const accessToken = jwt.sign(
      { userId, sessionId: session.id },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any }
    );

    return {
      accessToken,
      refreshToken,
      session,
    };
  }

  static async refreshSession(oldRefreshToken: string) {
    const hash = hashToken(oldRefreshToken);
    const sessionRecords = await db.select().from(sessions).where(eq(sessions.refreshTokenHash, hash)).limit(1);
    const session = sessionRecords[0];

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Delete old session
    await db.delete(sessions).where(eq(sessions.id, session.id));

    // Create new session
    return await this.createSessionAndTokens(session.userId, session.ipAddress || '', session.userAgent || '');
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    const hash = hashToken(refreshToken);
    await db.delete(sessions).where(eq(sessions.refreshTokenHash, hash));
  }

  static async forgotPassword(email: string) {
    const userRecords = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userRecords[0];

    if (!user) {
      return; // Do not reveal if user exists
    }

    const resetToken = generateRandomToken();
    
    await db.update(users).set({
      resetPasswordToken: hashToken(resetToken),
      resetPasswordExpires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    }).where(eq(users.id, user.id));

    await EmailService.sendPasswordReset(user.email, resetToken);
  }

  static async resetPassword(token: string, newPassword: string) {
    const hash = hashToken(token);
    
    const userRecords = await db.select().from(users).where(eq(users.resetPasswordToken, hash)).limit(1);
    const user = userRecords[0];

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new ValidationError('Token is invalid or has expired');
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.update(users).set({
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    }).where(eq(users.id, user.id));

    // Revoke all existing sessions
    await db.delete(sessions).where(eq(sessions.userId, user.id));
  }

  static async verifyEmail(token: string) {
    const hash = hashToken(token);
    
    const userRecords = await db.select().from(users).where(eq(users.verifyEmailToken, hash)).limit(1);
    const user = userRecords[0];

    if (!user || !user.verifyEmailExpires || user.verifyEmailExpires < new Date()) {
      throw new ValidationError('Token is invalid or has expired');
    }

    await db.update(users).set({
      emailVerified: true,
      verifyEmailToken: null,
      verifyEmailExpires: null,
    }).where(eq(users.id, user.id));
  }

  static async resendVerification(email: string) {
    const userRecords = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userRecords[0];

    if (!user || user.emailVerified) {
      return; // Do not reveal user exists or if already verified
    }

    const verifyToken = generateRandomToken();
    
    await db.update(users).set({
      verifyEmailToken: hashToken(verifyToken),
      verifyEmailExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }).where(eq(users.id, user.id));

    await EmailService.sendEmailVerification(user.email, verifyToken);
  }

  static async listSessions(userId: string) {
    return await db
      .select({
        id: sessions.id,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId));
  }

  static async revokeSession(userId: string, sessionId: string) {
    const sessionRecords = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
      .limit(1);
    const session = sessionRecords[0];

    if (!session) {
      throw new NotFoundError('Session not found or unauthorized');
    }

    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  static async logoutAll(userId: string, currentSessionId?: string) {
    if (currentSessionId) {
      await db
        .delete(sessions)
        .where(
          and(
            eq(sessions.userId, userId),
            not(eq(sessions.id, currentSessionId))
          )
        );
    } else {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }
  }

  static async checkEmail(email: string) {
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return userRecords.length > 0;
  }
}
