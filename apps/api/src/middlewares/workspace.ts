import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@layers/shared';
import { db, workspaces, workspaceMembers } from '@layers/database';
import { eq, and } from 'drizzle-orm';

export const requireWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.params.workspaceId || req.headers['x-workspace-id'];

    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw new ForbiddenError('Workspace ID is required');
    }

    const workspaceRecord = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
    if (!workspaceRecord || workspaceRecord.length === 0) {
      throw new NotFoundError('Workspace not found');
    }

    const memberRecord = await db.select().from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, req.user.id))).limit(1);

    if (!memberRecord || memberRecord.length === 0) {
      throw new ForbiddenError('You are not a member of this workspace');
    }

    req.workspace = workspaceRecord[0];
    req.member = memberRecord[0];
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.member || !roles.includes(req.member.role)) {
      next(new ForbiddenError('You do not have permission to perform this action'));
      return;
    }
    next();
  };
};
