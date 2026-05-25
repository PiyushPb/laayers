import { Request, Response } from 'express';
import { db, workspaceModules } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, ValidationError } from '@layers/shared';

const ALLOWED_MODULES = ['blogs', 'chat'];

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

  if (!ALLOWED_MODULES.includes(moduleKey)) {
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

    return res.status(200).json(sendSuccess({ module: inserted }, 'Module status updated'));
  }

  const [updated] = await db
    .update(workspaceModules)
    .set({ enabled })
    .where(eq(workspaceModules.id, existing.id))
    .returning();

  res.status(200).json(sendSuccess({ module: updated }, 'Module status updated'));
};
