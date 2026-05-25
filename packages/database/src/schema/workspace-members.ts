import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { workspaces } from './workspaces';

export const workspaceMembers = pgTable('workspace_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // owner, admin, member, viewer
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => {
  return {
    workspaceUserIdx: uniqueIndex('workspace_user_idx').on(table.workspaceId, table.userId),
  };
});
