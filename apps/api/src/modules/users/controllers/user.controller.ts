import { Request, Response } from 'express';
import { sendSuccess, ValidationError } from '@layers/shared';
import { db, workspaces, workspaceMembers, users } from '@layers/database';
import { eq, and, ne, isNull } from 'drizzle-orm';
import { updateMeSchema, updateAvatarSchema, paginationQuerySchema } from '../schemas/user.schema';

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ user: req.user }));
};

export const updateMe = async (req: Request, res: Response) => {
  const { name } = updateMeSchema.parse(req).body;

  await db.update(users).set({ name }).where(eq(users.id, req.user.id));
  res.status(200).json(sendSuccess(null, 'User updated'));
};

export const deleteMe = async (req: Request, res: Response) => {
  const ownedWorkspaces = await db.select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.userId, req.user.id), eq(workspaceMembers.role, 'owner')));

  for (const mw of ownedWorkspaces) {
    const otherOwners = await db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, mw.workspaceId), eq(workspaceMembers.role, 'owner'), ne(workspaceMembers.userId, req.user.id)));

    if (otherOwners.length === 0) {
      throw new ValidationError('You are the sole owner of one or more workspaces. Please transfer ownership or delete them before deleting your account.');
    }
  }

  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, req.user.id));
  
  res.status(200).json(sendSuccess(null, 'User deleted'));
};

export const getMyWorkspaces = async (req: Request, res: Response) => {
  const { page, limit } = paginationQuerySchema.parse({ query: req.query }).query;
  const offset = (page - 1) * limit;

  let activeWorkspaceId = req.cookies.workspaceId || req.headers['x-workspace-id'];

  const results = await db.select({
    workspace: workspaces,
    role: workspaceMembers.role,
  })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(and(eq(workspaceMembers.userId, req.user.id), isNull(workspaces.deletedAt)))
    .limit(limit)
    .offset(offset);

  const formattedWorkspaces = results.map(r => ({
    ...r.workspace,
    role: r.role,
    isCurrent: r.workspace.id === activeWorkspaceId,
  }));

  res.status(200).json(sendSuccess({ workspaces: formattedWorkspaces, page, limit }));
};



export const updateMyAvatar = async (req: Request, res: Response) => {
  const { avatarUrl } = updateAvatarSchema.parse(req).body;
  await db.update(users).set({ avatarUrl }).where(eq(users.id, req.user.id));
  res.status(200).json(sendSuccess({ avatarUrl }, 'Avatar updated successfully'));
};
