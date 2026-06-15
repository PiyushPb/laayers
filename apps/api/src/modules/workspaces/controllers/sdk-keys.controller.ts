import { Request, Response } from 'express';
import { db, workspaceSdkKeys, auditLogs } from '@layers/database';
import { eq } from 'drizzle-orm';
import { sendSuccess } from '@layers/shared';
import crypto from 'crypto';

export const getSdkKeys = async (req: Request, res: Response) => {
  const [keys] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(eq(workspaceSdkKeys.workspaceId, req.workspace.id))
    .limit(1);

  if (!keys) {
    // If somehow not initialized, generate now
    const newPub = `pk_${crypto.randomBytes(16).toString('hex')}`;
    const newSec = `sk_${crypto.randomBytes(32).toString('hex')}`;
    const [inserted] = await db
      .insert(workspaceSdkKeys)
      .values({
        workspaceId: req.workspace.id,
        publicKey: newPub,
        secretKey: newSec,
      })
      .returning();

    return res.status(200).json(sendSuccess({
      publicKey: inserted.publicKey,
      secretKey: `sk_••••••••••••••••••••••••••••••••${inserted.secretKey.slice(-4)}`,
    }));
  }

  res.status(200).json(sendSuccess({
    publicKey: keys.publicKey,
    secretKey: `sk_••••••••••••••••••••••••••••••••${keys.secretKey.slice(-4)}`,
  }));
};

export const rotateSdkKeys = async (req: Request, res: Response) => {
  const newPub = `pk_${crypto.randomBytes(16).toString('hex')}`;
  const newSec = `sk_${crypto.randomBytes(32).toString('hex')}`;

  const [keys] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(eq(workspaceSdkKeys.workspaceId, req.workspace.id))
    .limit(1);

  if (!keys) {
    const [inserted] = await db
      .insert(workspaceSdkKeys)
      .values({
        workspaceId: req.workspace.id,
        publicKey: newPub,
        secretKey: newSec,
      })
      .returning();

    await db.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: 'sdk_keys.rotated',
      entityType: 'sdk_key',
      entityId: req.workspace.id,
      metadata: { publicKey: newPub },
    });

    // On rotation, return the full unmasked keys
    return res.status(200).json(sendSuccess({
      publicKey: inserted.publicKey,
      secretKey: inserted.secretKey,
    }, 'SDK Keys rotated successfully'));
  }

  const [updated] = await db
    .update(workspaceSdkKeys)
    .set({
      publicKey: newPub,
      secretKey: newSec,
    })
    .where(eq(workspaceSdkKeys.workspaceId, req.workspace.id))
    .returning();

  await db.insert(auditLogs).values({
    workspaceId: req.workspace.id,
    userId: req.user.id,
    action: 'sdk_keys.rotated',
    entityType: 'sdk_key',
    entityId: req.workspace.id,
    metadata: { publicKey: newPub },
  });

  res.status(200).json(sendSuccess({
    publicKey: updated.publicKey,
    secretKey: updated.secretKey,
  }, 'SDK Keys rotated successfully'));
};
