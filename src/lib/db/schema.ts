import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  threadId: text('thread_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const teaSessions = sqliteTable('tea_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  threadId: text('thread_id').notNull().unique(),
  teaType: text('tea_type').notNull(),
  teaStyle: text('tea_style').notNull(),
  brewingTemp: integer('brewing_temp'),  // in Celsius
  steepTime: integer('steep_time'),      // in seconds
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  notes: text('notes')
});
