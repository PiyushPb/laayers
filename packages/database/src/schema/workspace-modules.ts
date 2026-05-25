import { pgTable, text, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { workspaces } from './workspaces';

export const workspaceModules = pgTable('workspace_modules', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  moduleKey: text('module_key').notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  config: jsonb('config').default({}),
});
