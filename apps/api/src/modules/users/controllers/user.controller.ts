import { Request, Response } from 'express';
import { sendSuccess } from '@layers/shared';
import { db, workspaces, workspaceMembers, users } from '@layers/database';
import { eq } from 'drizzle-orm';

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ user: req.user }));
};

export const updateMe = async (req: Request, res: Response) => {
  // TODO: Implement update user logic
  res.status(200).json(sendSuccess(null, 'User updated'));
};

export const deleteMe = async (req: Request, res: Response) => {
  // TODO: Implement delete user logic
  res.status(200).json(sendSuccess(null, 'User deleted'));
};

export const getMyWorkspaces = async (req: Request, res: Response) => {
  const members = await db.select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, req.user.id));

  let activeWorkspaceId = req.cookies.workspaceId || req.headers['x-workspace-id'];

  if (!activeWorkspaceId && members.length > 0) {
    activeWorkspaceId = members[0].workspaceId;
  }

  const workspacesList = await Promise.all(members.map(async (m) => {
    const [workspace] = await db.select()
      .from(workspaces)
      .where(eq(workspaces.id, m.workspaceId))
      .limit(1);

    if (!workspace) return null;

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      role: m.role,
      isCurrent: workspace.id === activeWorkspaceId,
    };
  }));

  const filtered = workspacesList.filter((w) => w !== null);

  res.status(200).json(sendSuccess({ workspaces: filtered }));
};

export const updateMyAvatar = async (req: Request, res: Response) => {
  // Scaffold: simply set a simulated or provided avatar URL in the DB
  const avatarUrl = req.body.avatarUrl || `https://avatar.vercel.sh/${encodeURIComponent(req.user.name)}`;

  await db.update(users)
    .set({ avatarUrl })
    .where(eq(users.id, req.user.id));

  res.status(200).json(sendSuccess({ avatarUrl }, 'Avatar updated successfully (scaffold)'));
};
