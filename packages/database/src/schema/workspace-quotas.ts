import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const workspaceQuotas = pgTable('workspace_quotas', {
  workspaceId: text('workspace_id').primaryKey().references(() => workspaces.id, { onDelete: 'cascade' }),
  maxMembers: integer('max_members'),
  maxBlogs: integer('max_blogs'),
  maxChats: integer('max_chats'),
  maxStorageMb: integer('max_storage_mb'),
});
