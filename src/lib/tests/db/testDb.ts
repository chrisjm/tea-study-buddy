import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { teaSessions, messages } from '$lib/db/schema';

/**
 * Creates a new test database instance with a unique file name
 * to prevent conflicts between parallel test runs
 */
export async function createTestDb() {
  const dbName = `test-${Date.now()}-${Math.random().toString(36).slice(2)}.db`;
  const client = createClient({
    url: `file:${dbName}`,
  });
  const db = drizzle(client);

  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tea_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT UNIQUE,
      tea_type TEXT NOT NULL,
      tea_style TEXT NOT NULL,
      brewing_temp INTEGER,
      steep_time INTEGER,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER
    );
  `);

  return {
    db,
    client,
    cleanup: async () => {
      try {
        await client.close();
        // Delete the database file
        const fs = require('fs');
        try {
          fs.unlinkSync(dbName);
          fs.unlinkSync(`${dbName}-wal`); // Delete WAL file if it exists
          fs.unlinkSync(`${dbName}-shm`); // Delete SHM file if it exists
        } catch (error) {
          // Ignore errors if files don't exist
        }
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  };
}

/**
 * Helper function to clear all data from the test database
 */
export async function clearTestDb(db: ReturnType<typeof drizzle>) {
  await db.delete(messages);
  await db.delete(teaSessions);
}

/**
 * Helper function to create a test tea session
 */
export async function createTestSession(db: ReturnType<typeof drizzle>, data: Partial<typeof teaSessions.$inferInsert> = {}) {
  const sessionData = {
    teaType: 'Test Tea',
    teaStyle: 'Test Style',
    brewingTemp: 80,
    steepTime: 180,
    notes: 'Test Notes',
    createdAt: new Date(),
    ...data
  };

  const result = await db.insert(teaSessions).values(sessionData).returning();
  return result[0];
}

/**
 * Helper function to create a test message
 */
export async function createTestMessage(db: ReturnType<typeof drizzle>, data: Partial<typeof messages.$inferInsert> = {}) {
  const messageData = {
    threadId: 'test-thread',
    role: 'user' as const,
    content: 'Test message',
    createdAt: new Date(),
    ...data
  };

  const result = await db.insert(messages).values(messageData).returning();
  return result[0];
}
