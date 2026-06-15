import { Request, Response } from 'express';
import { sendSuccess, ValidationError, NotFoundError, hashToken } from '@layers/shared';
import { db, workspaceInvitations, workspaces, workspaceMembers, users } from '@layers/database';
import { eq, and } from 'drizzle-orm';

export const getInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;
  const hashedToken = hashToken(token);

  const invitations = await db.select({
    id: workspaceInvitations.id,
    email: workspaceInvitations.email,
    role: workspaceInvitations.role,
    expiresAt: workspaceInvitations.expiresAt,
    workspace: {
      id: workspaces.id,
      name: workspaces.name,
    },
    inviter: {
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
    }
  })
  .from(workspaceInvitations)
  .innerJoin(workspaces, eq(workspaceInvitations.workspaceId, workspaces.id))
  .innerJoin(users, eq(workspaceInvitations.invitedBy, users.id))
  .where(eq(workspaceInvitations.token, hashedToken))
  .limit(1);

  const invitation = invitations[0];

  if (!invitation) {
    throw new NotFoundError('Invitation not found or invalid');
  }

  if (invitation.expiresAt < new Date()) {
    throw new ValidationError('Invitation has expired');
  }

  res.status(200).json(sendSuccess({ invitation }));
};

export const acceptInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;
  const hashedToken = hashToken(token);

  const invitations = await db.select().from(workspaceInvitations).where(eq(workspaceInvitations.token, hashedToken)).limit(1);
  const invitation = invitations[0];

  if (!invitation || invitation.expiresAt < new Date()) {
    throw new ValidationError('Invitation is invalid or has expired');
  }

  // Ensure the user accepting is the one invited
  if (req.user.email !== invitation.email) {
    throw new ValidationError('This invitation was sent to a different email address');
  }

  const existingMember = await db.select().from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, invitation.workspaceId), eq(workspaceMembers.userId, req.user.id))).limit(1);

  if (existingMember.length > 0) {
    throw new ValidationError('You are already a member of this workspace');
  }

  await db.transaction(async (tx) => {
    await tx.insert(workspaceMembers).values({
      workspaceId: invitation.workspaceId,
      userId: req.user.id,
      role: invitation.role,
    });

    await tx.delete(workspaceInvitations).where(eq(workspaceInvitations.id, invitation.id));
  });

  res.status(200).json(sendSuccess(null, 'Invitation accepted'));
};

export const rejectInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;
  const hashedToken = hashToken(token);

  const invitations = await db.select().from(workspaceInvitations).where(eq(workspaceInvitations.token, hashedToken)).limit(1);
  const invitation = invitations[0];

  if (!invitation) {
    throw new NotFoundError('Invitation not found');
  }

  // Ensure the user rejecting is the one invited
  if (req.user.email !== invitation.email) {
    throw new ValidationError('This invitation was sent to a different email address');
  }

  await db.delete(workspaceInvitations).where(eq(workspaceInvitations.id, invitation.id));

  res.status(200).json(sendSuccess(null, 'Invitation rejected'));
};
