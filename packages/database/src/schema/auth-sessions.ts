import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';

export const authSessions = pgTable('auth_sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionTokenHash: text('session_token_hash').notNull().unique(),
  refreshTokenHash: text('refresh_token_hash').notNull().unique(),
  deviceId: text('device_id'),
  deviceName: text('device_name'),
  deviceType: text('device_type'),
  browser: text('browser'),
  os: text('os'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
