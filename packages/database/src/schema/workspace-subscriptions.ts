import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { workspaces } from './workspaces';

export const workspaceSubscriptions = pgTable('workspace_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  clusterId: text('cluster_id'), // To support multiple clusters per workspace with separate billing cycles
  planId: text('plan_id').notNull(), // e.g., 'free', 'pro', 'enterprise'
  status: text('status').default('active').notNull(), // active, past_due, canceled, trialing
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
