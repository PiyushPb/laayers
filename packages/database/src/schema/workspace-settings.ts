import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const workspaceSettings = pgTable('workspace_settings', {
  workspaceId: text('workspace_id').primaryKey().references(() => workspaces.id, { onDelete: 'cascade' }),
  branding: jsonb('branding').default({}),
  preferences: jsonb('preferences').default({}),
});
