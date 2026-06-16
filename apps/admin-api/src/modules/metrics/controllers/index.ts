import { Request, Response, NextFunction } from 'express';
import { db, users, workspaces, workspaceModules } from '@layers/database';
import { sql } from 'drizzle-orm';
import { sendSuccess } from '@layers/shared';

export const getOverviewMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsersRes] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [totalWorkspacesRes] = await db.select({ count: sql<number>`count(*)::int` }).from(workspaces);
    
    // Get count of enabled modules
    const modulesDistribution = await db
      .select({
        moduleKey: workspaceModules.moduleKey,
        count: sql<number>`count(*)::int`
      })
      .from(workspaceModules)
      .where(sql`${workspaceModules.enabled} = true`)
      .groupBy(workspaceModules.moduleKey);

    res.status(200).json(sendSuccess({
      metrics: {
        totalUsers: totalUsersRes?.count || 0,
        totalWorkspaces: totalWorkspacesRes?.count || 0,
        moduleAdoption: modulesDistribution
      }
    }));
  } catch (err) {
    next(err);
  }
};
