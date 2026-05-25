import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const workspaceQuotas = pgTable('workspace_quotas', {
  workspaceId: text('workspace_id').primaryKey().references(() => workspaces.id, { onDelete: 'cascade' }),
  maxMembers: integer('max_members').default(5).notNull(),
  maxBlogs: integer('max_blogs').default(1).notNull(),
  maxChats: integer('max_chats').default(1000).notNull(),
  maxStorageMb: integer('max_storage_mb').default(500).notNull(),
});
