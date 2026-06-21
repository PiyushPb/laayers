import { Request, Response } from 'express';
import { db, workspaceDomains, auditLogs } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, ValidationError, NotFoundError } from '@layers/shared';
import crypto from 'crypto';
import dns from 'dns/promises';

function normalizeDomain(domain: string): string {
  let clean = domain.trim().toLowerCase();
  clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
  clean = clean.split('/')[0];
  return clean;
}

export const listDomains = async (req: Request, res: Response) => {
  const domains = await db
    .select()
    .from(workspaceDomains)
    .where(eq(workspaceDomains.workspaceId, req.workspace.id));

  res.status(200).json(sendSuccess({ domains }));
};

export const getDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');
  res.status(200).json(sendSuccess({ domain }));
};

export const addDomain = async (req: Request, res: Response) => {
  const { domain, primary = false } = req.body;
  const normalized = normalizeDomain(domain);

  // Check global uniqueness
  const [existing] = await db
    .select()
    .from(workspaceDomains)
    .where(eq(workspaceDomains.domain, normalized))
    .limit(1);

  if (existing) {
    throw new ValidationError(`Domain ${normalized} is already registered`);
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const result = await db.transaction(async (tx) => {
    if (primary) {
      await tx
        .update(workspaceDomains)
        .set({ primary: false })
        .where(eq(workspaceDomains.workspaceId, req.workspace.id));
    }

    const [newDomain] = await tx
      .insert(workspaceDomains)
      .values({
        workspaceId: req.workspace.id,
        domain: normalized,
        primary,
        status: 'pending',
        verificationToken,
      })
      .returning();

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.domain.created',
      entityType: 'domain',
      entityId: newDomain.id,
      newValue: { domain: normalized, primary },
    });

    return newDomain;
  });

  res.status(201).json(sendSuccess({ domain: result }, 'Domain added successfully'));
};

export const updateDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const { primary } = req.body; // could add other settings later like redirectUrl

  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');

  const result = await db.transaction(async (tx) => {
    if (primary) {
      await tx
        .update(workspaceDomains)
        .set({ primary: false })
        .where(eq(workspaceDomains.workspaceId, req.workspace.id));
    }

    const [updated] = await tx
      .update(workspaceDomains)
      .set({ primary: primary !== undefined ? primary : domain.primary })
      .where(eq(workspaceDomains.id, domainId))
      .returning();

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.domain.updated',
      entityType: 'domain',
      entityId: domainId,
      oldValue: { primary: domain.primary },
      newValue: { primary: updated.primary },
    });

    return updated;
  });

  res.status(200).json(sendSuccess({ domain: result }, 'Domain updated successfully'));
};

export const deleteDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;

  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');

  await db.transaction(async (tx) => {
    await tx
      .delete(workspaceDomains)
      .where(eq(workspaceDomains.id, domainId));

    await tx.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'user',
      userId: req.user.id,
      action: 'workspace.domain.deleted',
      entityType: 'domain',
      entityId: domainId,
      oldValue: { domain: domain.domain },
    });
  });

  res.status(200).json(sendSuccess(null, 'Domain deleted successfully'));
};

export const verifyDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;

  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');
  if (domain.status === 'verified') return res.status(200).json(sendSuccess({ domain }, 'Domain already verified'));

  let verified = false;
  try {
    const txtRecords = await dns.resolveTxt(domain.domain);
    for (const record of txtRecords) {
      if (record.join('').includes(`layers-verification=${domain.verificationToken}`)) {
        verified = true;
        break;
      }
    }
  } catch (err) {
    // DNS resolution failed or no TXT records
  }

  if (verified) {
    const [updated] = await db
      .update(workspaceDomains)
      .set({ status: 'verified' })
      .where(eq(workspaceDomains.id, domainId))
      .returning();

    await db.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      actorType: 'system',
      userId: null,
      action: 'workspace.domain.verified',
      entityType: 'domain',
      entityId: domainId,
      newValue: { status: 'verified' },
    });
    return res.status(200).json(sendSuccess({ domain: updated }, 'Domain verified successfully'));
  }

  return res.status(400).json(sendSuccess({ domain }, 'Verification failed. TXT record not found.'));
};

export const setPrimaryDomain = async (req: Request, res: Response) => {
  req.body.primary = true;
  return updateDomain(req, res);
};

export const getDnsRecords = async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');

  res.status(200).json(sendSuccess({
    records: [
      { type: 'TXT', name: '@', value: `layers-verification=${domain.verificationToken}` },
      { type: 'CNAME', name: 'www', value: 'cname.layers.com' } // Example CNAME
    ]
  }));
};

export const getVerificationStatus = async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) throw new NotFoundError('Domain not found');

  res.status(200).json(sendSuccess({
    status: domain.status,
    lastChecked: new Date().toISOString()
  }));
};
