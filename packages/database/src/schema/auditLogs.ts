import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { workspaces } from './workspaces';

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // e.g., 'workspace.update', 'member.invite'
  entityType: text('entity_type').notNull(), // e.g., 'workspace', 'member'
  entityId: text('entity_id').notNull(),
  metadata: jsonb('metadata').default('{}' as any).notNull(), // Changed {} to string cast to avoid Drizzle typings issues, or better '{}'::jsonb which is done via .default('{}')
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
