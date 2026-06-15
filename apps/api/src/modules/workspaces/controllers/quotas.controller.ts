import { Request, Response } from 'express';
import { db, workspaceQuotas, workspaceMembers, workspaceModules } from '@layers/database';
import { eq, sql, and } from 'drizzle-orm';
import { sendSuccess, CLUSTERS_CONFIG, CORE_QUOTAS, ClusterId, ValidationError } from '@layers/shared';

export const getQuotas = async (req: Request, res: Response) => {
  let [quotas] = await db
    .select()
    .from(workspaceQuotas)
    .where(eq(workspaceQuotas.workspaceId, req.workspace.id))
    .limit(1);

  if (!quotas) {
    [quotas] = await db
      .insert(workspaceQuotas)
      .values({
        workspaceId: req.workspace.id,
      })
      .returning();
  }

  // Calculate actual member count consumption
  const [memberCountResult] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, req.workspace.id));

  const activeMembers = memberCountResult?.count || 0;

  // Fetch enabled modules for the workspace
  const enabledModules = await db
    .select({ moduleKey: workspaceModules.moduleKey })
    .from(workspaceModules)
    .where(and(
      eq(workspaceModules.workspaceId, req.workspace.id),
      eq(workspaceModules.enabled, true)
    ));

  const requestedCluster = req.query.cluster as string | undefined;

  if (requestedCluster && requestedCluster !== 'core') {
    const isEnabled = enabledModules.some(m => m.moduleKey === requestedCluster);
    if (!isEnabled) {
      throw new ValidationError(`Module '${requestedCluster}' is not enabled for this workspace.`);
    }
  }

  const limits: Record<string, number> = {};
  const consumption: Record<string, number> = {};

  const coreQuotas = CORE_QUOTAS as readonly string[];
  // Add core quotas if no specific cluster is requested, or if 'core' is explicitly requested
  if (!requestedCluster || requestedCluster === 'core') {
    if (coreQuotas.includes('members')) {
      limits.maxMembers = quotas.maxMembers;
      consumption.members = activeMembers;
    }
    if (coreQuotas.includes('storageMb')) {
      limits.maxStorageMb = quotas.maxStorageMb;
      consumption.storageMb = 0; // Placeholder until file upload is built
    }
  }

  // Dynamically add quotas for enabled modules
  for (const module of enabledModules) {
    const clusterId = module.moduleKey as ClusterId;
    
    // Skip if a specific cluster is requested and it doesn't match
    if (requestedCluster && requestedCluster !== clusterId) {
      continue;
    }

    const config = CLUSTERS_CONFIG[clusterId];
    
    if (config) {
      const clusterQuotas = config.quotas as readonly string[];
      if (clusterQuotas.includes('blogs')) {
        limits.maxBlogs = quotas.maxBlogs;
        consumption.blogs = 0; // Placeholder until blogs module is built
      }
      if (clusterQuotas.includes('chats')) {
        limits.maxChats = quotas.maxChats;
        consumption.chats = 0; // Placeholder until chat logs are active
      }
    }
  }

  res.status(200).json(sendSuccess({
    limits,
    consumption,
  }));
};
