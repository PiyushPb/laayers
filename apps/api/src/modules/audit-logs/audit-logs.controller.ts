import { Request, Response } from 'express';
import { db, auditLogs } from '@layers/database';
import { eq, and, desc } from 'drizzle-orm';
import { sendSuccess, NotFoundError } from '@layers/shared';

export const listAuditLogs = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  
  // Real implementation would parse cursor, actor_id, action, etc.
  const logs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.workspaceId, req.workspace.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  res.status(200).json(sendSuccess({ data: logs, meta: { has_more: false } }));
};

export const getAuditLog = async (req: Request, res: Response) => {
  const { id } = req.params;

  const [log] = await db
    .select()
    .from(auditLogs)
    .where(and(eq(auditLogs.id, id), eq(auditLogs.workspaceId, req.workspace.id)))
    .limit(1);

  if (!log) throw new NotFoundError('Audit log not found');

  res.status(200).json(sendSuccess({ data: log }));
};
