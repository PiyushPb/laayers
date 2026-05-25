import { Request, Response } from 'express';
import { db, workspaceDomains } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, ValidationError, NotFoundError } from '@layers/shared';

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
        verified: false,
      })
      .returning();

    return newDomain;
  });

  res.status(201).json(sendSuccess({ domain: result }, 'Domain added successfully'));
};

export const updateDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const { primary } = req.body;

  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) {
    throw new NotFoundError('Domain not found');
  }

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

  if (!domain) {
    throw new NotFoundError('Domain not found');
  }

  await db
    .delete(workspaceDomains)
    .where(eq(workspaceDomains.id, domainId));

  res.status(200).json(sendSuccess(null, 'Domain deleted successfully'));
};

export const verifyDomain = async (req: Request, res: Response) => {
  const { domainId } = req.params;

  const [domain] = await db
    .select()
    .from(workspaceDomains)
    .where(and(eq(workspaceDomains.id, domainId), eq(workspaceDomains.workspaceId, req.workspace.id)))
    .limit(1);

  if (!domain) {
    throw new NotFoundError('Domain not found');
  }

  const [updated] = await db
    .update(workspaceDomains)
    .set({ verified: true })
    .where(eq(workspaceDomains.id, domainId))
    .returning();

  res.status(200).json(sendSuccess({ domain: updated }, 'Domain verified successfully'));
};
