import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const loginAttempts = pgTable('login_attempts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull(),
  ipAddress: text('ip_address'),
  success: boolean('success').notNull(),
  failureReason: text('failure_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
