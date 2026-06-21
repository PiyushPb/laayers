import { pgTable, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { workspaces } from './workspaces';

export const workspaceDomains = pgTable('workspace_domains', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(),
  status: text('status').default('pending').notNull(), // pending, verified, failed
  verificationToken: text('verification_token'),
  primary: boolean('primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    domainIdx: uniqueIndex('domain_idx').on(table.domain),
  };
});
