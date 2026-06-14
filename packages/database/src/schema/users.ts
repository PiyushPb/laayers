import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  passwordHash: text('password_hash'),
  emailVerifiedAt: timestamp('email_verified_at'),
  status: text('status').default('active').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  marketingEmailsEnabled: boolean('marketing_emails_enabled').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
