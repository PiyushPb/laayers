import { Request, Response } from 'express';
import { db, workspaceSdkKeys, auditLogs } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, NotFoundError, ValidationError } from '@layers/shared';
import crypto from 'crypto';

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

export const getSdkKeys = async (req: Request, res: Response) => {
  const keys = await db
    .select({
      id: workspaceSdkKeys.id,
      name: workspaceSdkKeys.name,
      prefix: workspaceSdkKeys.prefix,
      environment: workspaceSdkKeys.environment,
      scopes: workspaceSdkKeys.scopes,
      status: workspaceSdkKeys.status,
      lastUsedAt: workspaceSdkKeys.lastUsedAt,
      createdAt: workspaceSdkKeys.createdAt,
    })
    .from(workspaceSdkKeys)
    .where(eq(workspaceSdkKeys.workspaceId, req.workspace.id));

  res.status(200).json(sendSuccess({ keys }));
};

export const createSdkKey = async (req: Request, res: Response) => {
  const { name, environment, scopes = [] } = req.body;

  const envPrefix = environment === 'production' ? 'prod' : environment === 'preview' ? 'prev' : 'dev';
  const rawKey = `lyr_${envPrefix}_${crypto.randomBytes(32).toString('hex')}`;
  const prefix = rawKey.substring(0, 15);
  const hash = hashKey(rawKey);

  const result = await db.transaction(async (tx) => {
    const [newKey] = await tx
      .insert(workspaceSdkKeys)
      .values({
        workspaceId: req.workspace.id,
        name,
        prefix,
        hash,
        environment,
        scopes,
        status: 'active',
      })
      .returning();

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.sdk_key.created',
      entityType: 'sdk_key',
      entityId: newKey.id,
      newValue: { name, environment, prefix },
    });

    return newKey;
  });

  res.status(201).json(sendSuccess({
    key: { ...result, hash: undefined },
    rawKey // Displayed ONLY ONCE
  }, 'SDK Key created successfully'));
};

export const getSdkKeyDetails = async (req: Request, res: Response) => {
  const { keyId } = req.params;
  const [key] = await db
    .select({
      id: workspaceSdkKeys.id,
      name: workspaceSdkKeys.name,
      prefix: workspaceSdkKeys.prefix,
      environment: workspaceSdkKeys.environment,
      scopes: workspaceSdkKeys.scopes,
      status: workspaceSdkKeys.status,
      lastUsedAt: workspaceSdkKeys.lastUsedAt,
      createdAt: workspaceSdkKeys.createdAt,
    })
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');
  res.status(200).json(sendSuccess({ key }));
};

export const updateSdkKey = async (req: Request, res: Response) => {
  const { keyId } = req.params;
  const { name, scopes } = req.body;

  const [key] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');

  const [updated] = await db.transaction(async (tx) => {
    const [updatedKey] = await tx
      .update(workspaceSdkKeys)
      .set({
        name: name !== undefined ? name : key.name,
        scopes: scopes !== undefined ? scopes : key.scopes,
      })
      .where(eq(workspaceSdkKeys.id, keyId))
      .returning({
        id: workspaceSdkKeys.id,
        name: workspaceSdkKeys.name,
        prefix: workspaceSdkKeys.prefix,
        environment: workspaceSdkKeys.environment,
        scopes: workspaceSdkKeys.scopes,
        status: workspaceSdkKeys.status,
      });

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.sdk_key.updated',
      entityType: 'sdk_key',
      entityId: keyId,
      oldValue: { name: key.name, scopes: key.scopes },
      newValue: { name: updatedKey.name, scopes: updatedKey.scopes },
    });

    return [updatedKey];
  });

  res.status(200).json(sendSuccess({ key: updated }, 'SDK Key updated successfully'));
};

export const deleteSdkKey = async (req: Request, res: Response) => {
  const { keyId } = req.params;

  const [key] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');

  await db.transaction(async (tx) => {
    await tx.delete(workspaceSdkKeys).where(eq(workspaceSdkKeys.id, keyId));
    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.sdk_key.deleted',
      entityType: 'sdk_key',
      entityId: keyId,
      oldValue: { name: key.name, prefix: key.prefix },
    });
  });

  res.status(200).json(sendSuccess(null, 'SDK Key deleted successfully'));
};

export const rotateSdkKeys = async (req: Request, res: Response) => {
  const { keyId } = req.params;

  const [key] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');

  const envPrefix = key.environment === 'production' ? 'prod' : key.environment === 'preview' ? 'prev' : 'dev';
  const rawKey = `lyr_${envPrefix}_${crypto.randomBytes(32).toString('hex')}`;
  const prefix = rawKey.substring(0, 15);
  const hash = hashKey(rawKey);

  const [updated] = await db.transaction(async (tx) => {
    const [rotated] = await tx
      .update(workspaceSdkKeys)
      .set({ hash, prefix })
      .where(eq(workspaceSdkKeys.id, keyId))
      .returning({
        id: workspaceSdkKeys.id,
        name: workspaceSdkKeys.name,
        prefix: workspaceSdkKeys.prefix,
        environment: workspaceSdkKeys.environment,
      });

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.sdk_key.rotated',
      entityType: 'sdk_key',
      entityId: keyId,
      newValue: { prefix: rotated.prefix },
    });

    return [rotated];
  });

  res.status(200).json(sendSuccess({ key: updated, rawKey }, 'SDK Key rotated successfully'));
};

export const revokeSdkKey = async (req: Request, res: Response) => {
  const { keyId } = req.params;

  const [key] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');

  await db.transaction(async (tx) => {
    await tx.update(workspaceSdkKeys).set({ status: 'revoked' }).where(eq(workspaceSdkKeys.id, keyId));
    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.sdk_key.revoked',
      entityType: 'sdk_key',
      entityId: keyId,
      oldValue: { status: key.status },
      newValue: { status: 'revoked' },
    });
  });

  res.status(200).json(sendSuccess(null, 'SDK Key revoked successfully'));
};

export const revealSdkKey = async (req: Request, res: Response) => {
  throw new ValidationError('SDK Keys are securely hashed and cannot be revealed. Please rotate the key if you have lost it.');
};

export const toggleSdkKeyStatus = async (req: Request, res: Response) => {
  const { keyId, action } = req.params;
  const status = action === 'enable' ? 'active' : 'disabled';

  const [key] = await db
    .select()
    .from(workspaceSdkKeys)
    .where(and(eq(workspaceSdkKeys.id, keyId), eq(workspaceSdkKeys.workspaceId, req.workspace.id)))
    .limit(1);

  if (!key) throw new NotFoundError('SDK Key not found');

  await db.transaction(async (tx) => {
    await tx.update(workspaceSdkKeys).set({ status }).where(eq(workspaceSdkKeys.id, keyId));
    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: `workspace.sdk_key.${status}`,
      entityType: 'sdk_key',
      entityId: keyId,
      oldValue: { status: key.status },
      newValue: { status },
    });
  });

  res.status(200).json(sendSuccess(null, `SDK Key ${status} successfully`));
};
