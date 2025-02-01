import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  threadId: text('thread_id').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const teaSessions = sqliteTable('tea_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  threadId: text('thread_id').notNull().unique(),
  teaType: text('tea_type').notNull(),
  teaStyle: text('tea_style').notNull(),
  brewingTemp: integer('brewing_temp'),
  steepTime: integer('steep_time'),
  notes: text('notes'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});
