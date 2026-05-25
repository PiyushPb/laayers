import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { workspaces } from './workspaces';

export const workspaceSdkKeys = pgTable('workspace_sdk_keys', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull().unique(),
  secretKey: text('secret_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
