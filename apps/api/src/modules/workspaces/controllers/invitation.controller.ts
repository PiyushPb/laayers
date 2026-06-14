import { Request, Response } from 'express';
import { db, workspaceInvitations } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, NotFoundError, generateRandomToken, hashToken } from '@layers/shared';

export const revokeInvitation = async (req: Request, res: Response) => {
  const { invitationId } = req.params;

  const [invitation] = await db
    .select()
    .from(workspaceInvitations)
    .where(and(eq(workspaceInvitations.id, invitationId), eq(workspaceInvitations.workspaceId, req.workspace.id)))
    .limit(1);

  if (!invitation) {
    throw new NotFoundError('Invitation not found');
  }

  await db
    .delete(workspaceInvitations)
    .where(eq(workspaceInvitations.id, invitationId));

  res.status(200).json(sendSuccess(null, 'Invitation revoked successfully'));
};

export const resendInvitation = async (req: Request, res: Response) => {
  const { invitationId } = req.params;

  const [invitation] = await db
    .select()
    .from(workspaceInvitations)
    .where(and(eq(workspaceInvitations.id, invitationId), eq(workspaceInvitations.workspaceId, req.workspace.id)))
    .limit(1);

  if (!invitation) {
    throw new NotFoundError('Invitation not found');
  }

  const rawToken = generateRandomToken();
  const hashed = hashToken(rawToken);
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  await db
    .update(workspaceInvitations)
    .set({
      token: hashed,
      expiresAt: newExpiresAt,
    })
    .where(eq(workspaceInvitations.id, invitationId));

  // Email integration removed temporarily
  console.log(`Sending invitation to ${invitation.email} with token ${rawToken}`);

  res.status(200).json(sendSuccess(null, 'Invitation email resent successfully'));
};
