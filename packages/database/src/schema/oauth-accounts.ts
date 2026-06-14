import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';

export const oauthAccounts = pgTable('oauth_accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  providerEmail: text('provider_email'),
  linkedAt: timestamp('linked_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
