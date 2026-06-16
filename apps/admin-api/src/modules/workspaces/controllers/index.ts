import { Request, Response, NextFunction } from 'express';
import { db, workspaces, workspaceQuotas, workspaceModules } from '@layers/database';
import { eq, desc, and } from 'drizzle-orm';
import { sendSuccess, NotFoundError, ValidationError, ALLOWED_MODULES } from '@layers/shared';

export const listWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const list = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        plan: workspaces.plan,
        createdAt: workspaces.createdAt,
      })
      .from(workspaces)
      .orderBy(desc(workspaces.createdAt))
      .limit(limit)
      .offset(offset);

    res.status(200).json(sendSuccess({ workspaces: list, page, limit }));
  } catch (err) {
    next(err);
  }
};

import { PLANS_CONFIG } from '@layers/shared';

export const getWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, req.params.id)).limit(1);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const [quotas] = await db.select().from(workspaceQuotas).where(eq(workspaceQuotas.workspaceId, workspace.id)).limit(1);
    const modules = await db.select().from(workspaceModules).where(eq(workspaceModules.workspaceId, workspace.id));

    const planId = workspace.plan || 'free';
    const corePlanDefaults = PLANS_CONFIG.core[planId]?.limits || PLANS_CONFIG.core.free.limits;

    const effectiveQuotas: Record<string, number> = {
      maxMembers: quotas?.maxMembers ?? corePlanDefaults.maxMembers,
      maxStorageMb: quotas?.maxStorageMb ?? corePlanDefaults.maxStorageMb,
    };

    const blogsModule = modules.find(m => m.moduleKey === 'blogs');
    if (blogsModule && blogsModule.enabled) {
      const bPlan = blogsModule.plan || 'free';
      const bLimits = PLANS_CONFIG.blogs[bPlan]?.limits || PLANS_CONFIG.blogs.free.limits;
      effectiveQuotas.maxBlogs = quotas?.maxBlogs ?? bLimits.maxBlogs;
    }

    const chatModule = modules.find(m => m.moduleKey === 'chat');
    if (chatModule && chatModule.enabled) {
      const cPlan = chatModule.plan || 'free';
      const cLimits = PLANS_CONFIG.chat[cPlan]?.limits || PLANS_CONFIG.chat.free.limits;
      effectiveQuotas.maxChats = quotas?.maxChats ?? cLimits.maxChats;
    }

    res.status(200).json(sendSuccess({ workspace, overrides: quotas, effectiveQuotas, modules }));
  } catch (err) {
    next(err);
  }
};

export const updateWorkspaceQuotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { maxMembers, maxBlogs, maxChats, maxStorageMb } = req.body;
    
    // Check if quota exists
    const [existing] = await db.select().from(workspaceQuotas).where(eq(workspaceQuotas.workspaceId, req.params.id)).limit(1);
    
    let updated;
    if (existing) {
      [updated] = await db
        .update(workspaceQuotas)
        .set({
          maxMembers: maxMembers !== undefined ? maxMembers : existing.maxMembers,
          maxBlogs: maxBlogs !== undefined ? maxBlogs : existing.maxBlogs,
          maxChats: maxChats !== undefined ? maxChats : existing.maxChats,
          maxStorageMb: maxStorageMb !== undefined ? maxStorageMb : existing.maxStorageMb,
        })
        .where(eq(workspaceQuotas.workspaceId, req.params.id))
        .returning();
    } else {
      [updated] = await db
        .insert(workspaceQuotas)
        .values({
          workspaceId: req.params.id,
          maxMembers: maxMembers !== undefined ? maxMembers : null,
          maxBlogs: maxBlogs !== undefined ? maxBlogs : null,
          maxChats: maxChats !== undefined ? maxChats : null,
          maxStorageMb: maxStorageMb !== undefined ? maxStorageMb : null,
        })
        .returning();
    }

    res.status(200).json(sendSuccess({ overrides: updated }, 'Quotas updated manually by admin'));
  } catch (err) {
    next(err);
  }
};

export const updateWorkspaceModules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { moduleKey, enabled, plan } = req.body;
    
    if (!(ALLOWED_MODULES as readonly string[]).includes(moduleKey)) {
      throw new ValidationError(`Invalid moduleKey. Must be one of: ${ALLOWED_MODULES.join(', ')}`);
    }

    if (enabled !== undefined && typeof enabled !== 'boolean') {
      throw new ValidationError('Property enabled must be boolean');
    }

    const [existing] = await db
      .select()
      .from(workspaceModules)
      .where(and(eq(workspaceModules.workspaceId, req.params.id), eq(workspaceModules.moduleKey, moduleKey)))
      .limit(1);

    let updated;
    if (existing) {
      [updated] = await db
        .update(workspaceModules)
        .set({ 
          enabled: enabled !== undefined ? enabled : existing.enabled,
          plan: plan !== undefined ? plan : existing.plan 
        })
        .where(eq(workspaceModules.id, existing.id))
        .returning();
    } else {
      [updated] = await db
        .insert(workspaceModules)
        .values({
          workspaceId: req.params.id,
          moduleKey,
          enabled: enabled !== undefined ? enabled : false,
          plan: plan || 'free',
          config: {},
        })
        .returning();
    }

    res.status(200).json(sendSuccess({ module: updated }, `Module ${moduleKey} forced to ${enabled} by admin`));
  } catch (err) {
    next(err);
  }
};

export const deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [deleted] = await db.delete(workspaces).where(eq(workspaces.id, req.params.id)).returning();
    if (!deleted) {
      throw new NotFoundError('Workspace not found');
    }
    
    res.status(200).json(sendSuccess({ deletedId: deleted.id }, 'Workspace permanently deleted'));
  } catch (err) {
    next(err);
  }
};
