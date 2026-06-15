import { Request, Response } from 'express';
import { db, workspaceSettings, auditLogs } from '@layers/database';
import { eq } from 'drizzle-orm';
import { sendSuccess } from '@layers/shared';

export const getSettings = async (req: Request, res: Response) => {
  const [settings] = await db
    .select()
    .from(workspaceSettings)
    .where(eq(workspaceSettings.workspaceId, req.workspace.id))
    .limit(1);

  if (!settings) {
    const [newSettings] = await db
      .insert(workspaceSettings)
      .values({
        workspaceId: req.workspace.id,
        branding: {},
        preferences: {},
      })
      .returning();
    return res.status(200).json(sendSuccess({ settings: newSettings }));
  }

  res.status(200).json(sendSuccess({ settings }));
};

export const updateSettings = async (req: Request, res: Response) => {
  const { branding, preferences } = req.body;

  const [settings] = await db
    .select()
    .from(workspaceSettings)
    .where(eq(workspaceSettings.workspaceId, req.workspace.id))
    .limit(1);

  const updatedBranding = branding !== undefined ? { ...(settings?.branding as object || {}), ...branding } : (settings?.branding || {});
  const updatedPreferences = preferences !== undefined ? { ...(settings?.preferences as object || {}), ...preferences } : (settings?.preferences || {});

  if (!settings) {
    const [newSettings] = await db
      .insert(workspaceSettings)
      .values({
        workspaceId: req.workspace.id,
        branding: updatedBranding,
        preferences: updatedPreferences,
      })
      .returning();

    await db.insert(auditLogs).values({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: 'settings.updated',
      entityType: 'settings',
      entityId: req.workspace.id,
      metadata: { branding: updatedBranding, preferences: updatedPreferences },
    });

    return res.status(200).json(sendSuccess({ settings: newSettings }, 'Settings updated successfully'));
  }

  const [updatedSettings] = await db
    .update(workspaceSettings)
    .set({
      branding: updatedBranding,
      preferences: updatedPreferences,
    })
    .where(eq(workspaceSettings.workspaceId, req.workspace.id))
    .returning();

  await db.insert(auditLogs).values({
    workspaceId: req.workspace.id,
    userId: req.user.id,
    action: 'settings.updated',
    entityType: 'settings',
    entityId: req.workspace.id,
    metadata: { branding: updatedBranding, preferences: updatedPreferences },
  });

  res.status(200).json(sendSuccess({ settings: updatedSettings }, 'Settings updated successfully'));
};
