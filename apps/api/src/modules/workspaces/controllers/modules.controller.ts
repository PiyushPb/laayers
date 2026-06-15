import { Request, Response } from 'express';
import { db, workspaceModules, auditLogs } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, ValidationError, ALLOWED_MODULES } from '@layers/shared';

export const listModules = async (req: Request, res: Response) => {
  const dbModules = await db
    .select()
    .from(workspaceModules)
    .where(eq(workspaceModules.workspaceId, req.workspace.id));

  // Merge with whitelist to ensure all possible modules are returned
  const modules = ALLOWED_MODULES.map(key => {
    const found = dbModules.find(m => m.moduleKey === key);
    return {
      moduleKey: key,
      enabled: found ? found.enabled : false,
      config: found ? found.config : {},
    };
  });

  res.status(200).json(sendSuccess({ modules }));
};

export const updateModule = async (req: Request, res: Response) => {
  const { moduleKey } = req.params;
  const { enabled } = req.body;

  if (!(ALLOWED_MODULES as readonly string[]).includes(moduleKey)) {
    throw new ValidationError(`Module '${moduleKey}' does not exist`);
  }

  if (typeof enabled !== 'boolean') {
    throw new ValidationError("Property 'enabled' must be a boolean");
  }

  const [existing] = await db
    .select()
    .from(workspaceModules)
    .where(and(eq(workspaceModules.workspaceId, req.workspace.id), eq(workspaceModules.moduleKey, moduleKey)))
    .limit(1);

  if (!existing) {
    const [inserted] = await db
      .insert(workspaceModules)
      .values({
        workspaceId: req.workspace.id,
        moduleKey,
        enabled,
        config: {},
      })
      .returning();

    await db.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: 'module.updated',
      entityType: 'module',
      entityId: inserted.id,
      metadata: { moduleKey, enabled },
    });

    return res.status(200).json(sendSuccess({ module: inserted }, 'Module status updated'));
  }

  const [updated] = await db
    .update(workspaceModules)
    .set({ enabled })
    .where(eq(workspaceModules.id, existing.id))
    .returning();

  await db.insert(auditLogs).values({
    workspaceId: req.workspace.id,
    userId: req.user.id,
    action: 'module.updated',
    entityType: 'module',
    entityId: updated.id,
    metadata: { moduleKey, enabled },
  });

  res.status(200).json(sendSuccess({ module: updated }, 'Module status updated'));
};
