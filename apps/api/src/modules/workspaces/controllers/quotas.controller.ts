import { Request, Response } from 'express';
import { db, workspaceQuotas, workspaceMembers, workspaceModules } from '@layers/database';
import { eq, sql, and } from 'drizzle-orm';
import { sendSuccess, CLUSTERS_CONFIG, CORE_QUOTAS, ClusterId, ValidationError, PLANS_CONFIG } from '@layers/shared';

export const getQuotas = async (req: Request, res: Response) => {
  let [quotas] = await db
    .select()
    .from(workspaceQuotas)
    .where(eq(workspaceQuotas.workspaceId, req.workspace.id))
    .limit(1);

  const corePlanId = req.workspace.plan || 'free';
  const corePlanDefaults = PLANS_CONFIG.core[corePlanId]?.limits || PLANS_CONFIG.core.free.limits;

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
    .select({ moduleKey: workspaceModules.moduleKey, plan: workspaceModules.plan })
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
      limits.maxMembers = quotas?.maxMembers ?? corePlanDefaults.maxMembers;
      consumption.members = activeMembers;
    }
    if (coreQuotas.includes('storageMb')) {
      limits.maxStorageMb = quotas?.maxStorageMb ?? corePlanDefaults.maxStorageMb;
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
      
      if (clusterId === 'blogs') {
        const blogsPlan = module.plan || 'free';
        const blogsDefaults = PLANS_CONFIG.blogs[blogsPlan]?.limits || PLANS_CONFIG.blogs.free.limits;
        
        if (clusterQuotas.includes('blogs')) {
          limits.maxBlogs = quotas?.maxBlogs ?? blogsDefaults.maxBlogs;
          consumption.blogs = 0; 
        }
      }

      if (clusterId === 'chat') {
        const chatPlan = module.plan || 'free';
        const chatDefaults = PLANS_CONFIG.chat[chatPlan]?.limits || PLANS_CONFIG.chat.free.limits;

        if (clusterQuotas.includes('chats')) {
          limits.maxChats = quotas?.maxChats ?? chatDefaults.maxChats;
          consumption.chats = 0; 
        }
      }
    }
  }

  res.status(200).json(sendSuccess({
    limits,
    consumption,
  }));
};

