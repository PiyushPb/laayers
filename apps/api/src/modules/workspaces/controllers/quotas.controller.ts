import { Request, Response } from 'express';
import { db, workspaceQuotas, workspaceMembers } from '@layers/database';
import { eq, sql } from 'drizzle-orm';
import { sendSuccess } from '@layers/shared';

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

  res.status(200).json(sendSuccess({
    limits: {
      maxMembers: quotas.maxMembers,
      maxBlogs: quotas.maxBlogs,
      maxChats: quotas.maxChats,
      maxStorageMb: quotas.maxStorageMb,
    },
    consumption: {
      members: activeMembers,
      blogs: 0, // Placeholder/scaffold until blogs module is built
      chats: 0, // Placeholder/scaffold until chat logs are active
      storageMb: 0, // Placeholder/scaffold until file upload is built
    },
  }));
};
