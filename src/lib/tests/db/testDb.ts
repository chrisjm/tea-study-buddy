import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import { teaSessions, messages } from '$lib/db/schema';
import { promises as fs } from 'fs';
import { resolve } from 'path';

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

  await migrate(db, { 
    migrationsFolder: resolve(__dirname, '../../../../drizzle')
  });

  return {
    db,
    client,
    cleanup: async () => {
      try {
        await client.close();
        // Delete the database file and its associated files
        try {
          await fs.unlink(dbName);
          await fs.unlink(`${dbName}-wal`).catch(() => { }); // Delete WAL file if it exists
          await fs.unlink(`${dbName}-shm`).catch(() => { }); // Delete SHM file if it exists
        } catch (error) {
          console.error('Error cleaning up test database files:', error);
        }
      } catch (error) {
        console.error('Error closing test database connection:', error);
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
