import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, getAccessTokenOptions, getRefreshTokenOptions } from '@layers/shared';
import { db, workspaces, workspaceMembers, workspaceModules } from '@layers/database';
import { eq, and } from 'drizzle-orm';

export const register = async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(sendSuccess({ user: { id: result.user.id, email: result.user.email } }, 'Registration successful. Please check your email to verify your account.'));
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.login(req.body, req.ip || '', req.headers['user-agent'] || '');

  res.cookie('accessToken', accessToken, getAccessTokenOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenOptions());

  res.status(200).json(sendSuccess({ accessToken }, 'Login successful'));
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await AuthService.refreshSession(token);

  res.cookie('accessToken', accessToken, getAccessTokenOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenOptions());

  res.status(200).json(sendSuccess({ accessToken }, 'Token refreshed'));
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await AuthService.logout(token);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json(sendSuccess(null, 'Logged out successfully'));
};

export const getSession = async (req: Request, res: Response) => {
  let currentWorkspace = null;
  let role = null;
  let enabledModules: string[] = [];
  let permissions: string[] = [];

  // Determine workspace context (from cookie or header)
  let workspaceId = req.cookies.workspaceId || req.headers['x-workspace-id'];

  if (workspaceId && typeof workspaceId === 'string') {
    const [memberRecord] = await db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, req.user.id)))
      .limit(1);

    if (memberRecord) {
      const [workspaceRecord] = await db.select()
        .from(workspaces)
        .where(eq(workspaces.id, workspaceId))
        .limit(1);

      if (workspaceRecord) {
        currentWorkspace = workspaceRecord;
        role = memberRecord.role;
      }
    }
  }

  // Fallback to first workspace if not set or invalid
  if (!currentWorkspace) {
    const [firstMemberRecord] = await db.select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, req.user.id))
      .limit(1);

    if (firstMemberRecord) {
      const [workspaceRecord] = await db.select()
        .from(workspaces)
        .where(eq(workspaces.id, firstMemberRecord.workspaceId))
        .limit(1);

      if (workspaceRecord) {
        currentWorkspace = workspaceRecord;
        role = firstMemberRecord.role;
      }
    }
  }

  // Set enabled modules and permissions
  if (currentWorkspace) {
    const modulesList = await db.select()
      .from(workspaceModules)
      .where(and(eq(workspaceModules.workspaceId, currentWorkspace.id), eq(workspaceModules.enabled, true)));
    
    enabledModules = modulesList.map(m => m.moduleKey);

    if (role === 'owner') {
      permissions = ['*'];
    } else if (role === 'admin') {
      permissions = [
        'workspace:read',
        'workspace:update',
        'members:read',
        'members:write',
        'settings:read',
        'settings:write',
        'invitations:read',
        'invitations:write',
        'domains:read',
        'domains:write',
        'sdk-keys:read',
        'sdk-keys:write',
        'modules:read',
        'modules:write',
        'quotas:read'
      ];
    } else if (role === 'member') {
      permissions = [
        'workspace:read',
        'members:read',
        'quotas:read'
      ];
    } else if (role === 'viewer') {
      permissions = [
        'workspace:read',
        'members:read',
        'quotas:read'
      ];
    }
  }

  res.status(200).json(sendSuccess({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
    },
    currentWorkspace,
    role,
    enabledModules,
    permissions,
  }));
};

export const forgotPassword = async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res.status(200).json(sendSuccess(null, 'If that email exists, a password reset link has been sent.'));
};

export const resetPassword = async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res.status(200).json(sendSuccess(null, 'Password has been reset successfully. Please log in.'));
};

export const verifyEmail = async (req: Request, res: Response) => {
  await AuthService.verifyEmail(req.body.token);
  res.status(200).json(sendSuccess(null, 'Email verified successfully.'));
};

export const resendVerification = async (req: Request, res: Response) => {
  await AuthService.resendVerification(req.body.email);
  res.status(200).json(sendSuccess(null, 'If that email exists and is not verified, a new link has been sent.'));
};

export const listSessions = async (req: Request, res: Response) => {
  const sessions = await AuthService.listSessions(req.user.id);
  const formattedSessions = sessions.map(s => ({
    ...s,
    isCurrent: s.id === req.sessionId,
  }));
  res.status(200).json(sendSuccess({ sessions: formattedSessions }));
};

export const revokeSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  await AuthService.revokeSession(req.user.id, sessionId);
  res.status(200).json(sendSuccess(null, 'Session revoked'));
};

export const logoutAll = async (req: Request, res: Response) => {
  await AuthService.logoutAll(req.user.id, req.sessionId);
  res.status(200).json(sendSuccess(null, 'All other sessions logged out'));
};

export const checkEmail = async (req: Request, res: Response) => {
  const isRegistered = await AuthService.checkEmail(req.body.email);
  res.status(200).json(sendSuccess({ registered: isRegistered }));
};
