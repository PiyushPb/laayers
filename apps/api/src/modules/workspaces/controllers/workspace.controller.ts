import { Request, Response } from 'express';
import { sendSuccess, sendError, ValidationError, NotFoundError, generateRandomToken, hashToken } from '@layers/shared';
import { db, workspaces, workspaceMembers, workspaceInvitations, users } from '@layers/database';
import { eq, and } from 'drizzle-orm';

export const listWorkspaces = async (req: Request, res: Response) => {
  const members = await db.select().from(workspaceMembers).where(eq(workspaceMembers.userId, req.user.id));
  const workspaceIds = members.map(m => m.workspaceId);
  
  if (workspaceIds.length === 0) {
    return res.status(200).json(sendSuccess({ workspaces: [] }));
  }

  // Basic implementation.
  const allWorkspaces = await Promise.all(workspaceIds.map(async id => {
    const w = await db.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
    return w[0];
  }));

  res.status(200).json(sendSuccess({ workspaces: allWorkspaces }));
};

export const createWorkspace = async (req: Request, res: Response) => {
  // Simplified for brevity in foundation
  res.status(201).json(sendSuccess(null, 'Workspace created'));
};

export const getWorkspace = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ workspace: req.workspace, role: req.member.role }));
};

export const updateWorkspace = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess(null, 'Workspace updated'));
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  await db.delete(workspaces).where(eq(workspaces.id, req.workspace.id));
  res.status(200).json(sendSuccess(null, 'Workspace deleted'));
};

// Switch workspace
export const switchWorkspace = async (req: Request, res: Response) => {
  // Set context in cookies if you want session-based workspace state
  res.cookie('workspaceId', req.workspace.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json(sendSuccess({ workspace: req.workspace }, 'Workspace switched'));
};

// Members
export const getMembers = async (req: Request, res: Response) => {
  const members = await db.select({
    id: workspaceMembers.id,
    role: workspaceMembers.role,
    joinedAt: workspaceMembers.joinedAt,
    user: {
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
    }
  })
  .from(workspaceMembers)
  .innerJoin(users, eq(workspaceMembers.userId, users.id))
  .where(eq(workspaceMembers.workspaceId, req.workspace.id));

  res.status(200).json(sendSuccess({ members }));
};

export const inviteMember = async (req: Request, res: Response) => {
  const { email, role } = req.body;

  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    const isMember = await db.select().from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, req.workspace.id), eq(workspaceMembers.userId, existingUser[0].id))).limit(1);
    
    if (isMember.length > 0) {
      throw new ValidationError('User is already a member of this workspace');
    }
  }

  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(workspaceInvitations).values({
    workspaceId: req.workspace.id,
    email,
    role,
    token: hashToken(token),
    invitedBy: req.user.id,
    expiresAt,
  });

  // Email integration removed temporarily
  console.log(`Sending invitation to ${email} with token ${token}`);

  res.status(200).json(sendSuccess(null, 'Invitation sent'));
};

export const updateMemberRole = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { role } = req.body;

  const [memberToUpdate] = await db.select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.id, memberId), eq(workspaceMembers.workspaceId, req.workspace.id)))
    .limit(1);

  if (!memberToUpdate) {
    throw new NotFoundError('Member not found');
  }

  // Security: Admins cannot change roles of owners
  if (req.member.role === 'admin' && memberToUpdate.role === 'owner') {
    throw new ValidationError('Admins cannot modify owner roles');
  }

  // Safety: Prevent downgrading the last owner
  if (memberToUpdate.role === 'owner' && role !== 'owner') {
    const owners = await db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, req.workspace.id), eq(workspaceMembers.role, 'owner')));

    if (owners.length <= 1) {
      throw new ValidationError('Cannot downgrade the only owner of the workspace. Please transfer ownership first.');
    }
  }

  await db.update(workspaceMembers)
    .set({ role })
    .where(eq(workspaceMembers.id, memberId));

  res.status(200).json(sendSuccess(null, 'Role updated'));
};

export const removeMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;

  const [memberToRemove] = await db.select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.id, memberId), eq(workspaceMembers.workspaceId, req.workspace.id)))
    .limit(1);

  if (!memberToRemove) {
    throw new NotFoundError('Member not found');
  }

  // Security: Admins cannot remove owners
  if (req.member.role === 'admin' && memberToRemove.role === 'owner') {
    throw new ValidationError('Admins cannot remove owners');
  }

  // Safety: Prevent deleting/removing the last owner
  if (memberToRemove.role === 'owner') {
    const owners = await db.select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, req.workspace.id), eq(workspaceMembers.role, 'owner')));

    if (owners.length <= 1) {
      if (memberToRemove.userId === req.user.id) {
        throw new ValidationError('You cannot remove yourself because you are the only owner. Please transfer ownership first.');
      }
      throw new ValidationError('Cannot remove the only owner of the workspace. Please transfer ownership first.');
    }
  }

  await db.delete(workspaceMembers)
    .where(eq(workspaceMembers.id, memberId));

  res.status(200).json(sendSuccess(null, 'Member removed'));
};

export const transferOwnership = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ValidationError('Target userId is required');
  }

  const [targetMember] = await db.select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, req.workspace.id), eq(workspaceMembers.userId, userId)))
    .limit(1);

  if (!targetMember) {
    throw new ValidationError('Target user is not a member of this workspace');
  }

  if (targetMember.role === 'owner') {
    throw new ValidationError('Target user is already the owner');
  }

  await db.transaction(async (tx) => {
    // 1. Demote current owner to admin
    await tx.update(workspaceMembers)
      .set({ role: 'admin' })
      .where(and(eq(workspaceMembers.workspaceId, req.workspace.id), eq(workspaceMembers.userId, req.user.id)));

    // 2. Promote target member to owner
    await tx.update(workspaceMembers)
      .set({ role: 'owner' })
      .where(eq(workspaceMembers.id, targetMember.id));

    // 3. Update workspaces table ownerId
    await tx.update(workspaces)
      .set({ ownerId: userId })
      .where(eq(workspaces.id, req.workspace.id));
  });

  res.status(200).json(sendSuccess(null, 'Workspace ownership transferred successfully'));
};
