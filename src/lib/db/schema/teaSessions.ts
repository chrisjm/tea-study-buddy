import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const teaSessions = sqliteTable('tea_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  threadId: text('thread_id').unique(),
  teaType: text('tea_type').notNull(),
  teaStyle: text('tea_style').notNull(),
  brewingTemp: integer('brewing_temp'),
  steepTime: integer('steep_time'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
});
