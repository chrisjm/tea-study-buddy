import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { teaSessions } from './teaSessions';

export const teaSteeps = sqliteTable('tea_steeps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teaSessionId: integer('tea_session_id')
    .notNull()
    .references(() => teaSessions.id),
  steepNumber: integer('steep_number').notNull(),
  temperature: integer('temperature'),
  steepTimeMin: integer('steep_time_min'),
  steepTimeMax: integer('steep_time_max'),
  actualSteepTime: integer('actual_steep_time'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
});
