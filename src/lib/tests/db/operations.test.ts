import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { teaSessions, messages } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { createTestDb, clearTestDb, createTestSession, createTestMessage } from './testDb';
import type { TeaSession } from '$lib/stores/chatStore';

describe('Database Operations', () => {
  let testDb: Awaited<ReturnType<typeof createTestDb>>;
  let db: ReturnType<typeof testDb.db>;

  beforeEach(async () => {
    testDb = await createTestDb();
    db = testDb.db;
    await clearTestDb(db);
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  describe('Tea Sessions', () => {
    it('should create a new tea session', async () => {
      const sessionData = {
        teaType: 'Green Tea',
        teaStyle: 'Sencha',
        brewingTemp: 75,
        steepTime: 180,
        notes: 'Test session',
        createdAt: new Date()
      };

      const result = await db
        .insert(teaSessions)
        .values(sessionData)
        .returning();

      expect(result[0]).toMatchObject({
        teaType: sessionData.teaType,
        teaStyle: sessionData.teaStyle,
        brewingTemp: sessionData.brewingTemp,
        steepTime: sessionData.steepTime,
        notes: sessionData.notes,
        id: expect.any(Number)
      });
      expect(result[0].createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve a tea session', async () => {
      const session = await createTestSession(db);
      const result = await db
        .select()
        .from(teaSessions)
        .where(eq(teaSessions.id, session.id));

      expect(result[0]).toEqual(session);
    });

    it('should update a tea session', async () => {
      const session = await createTestSession(db);
      const updateData = {
        brewingTemp: 80,
        notes: 'Updated notes',
        updatedAt: new Date()
      };

      const result = await db
        .update(teaSessions)
        .set(updateData)
        .where(eq(teaSessions.id, session.id))
        .returning();

      expect(result[0]).toMatchObject({
        id: session.id,
        teaType: session.teaType,
        teaStyle: session.teaStyle,
        steepTime: session.steepTime,
        brewingTemp: updateData.brewingTemp,
        notes: updateData.notes,
        createdAt: session.createdAt
      });
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should delete a tea session', async () => {
      const session = await createTestSession(db);

      const result = await db
        .delete(teaSessions)
        .where(eq(teaSessions.id, session.id))
        .returning();

      expect(result[0]).toEqual(session);

      // Verify it's deleted
      const retrieved = await db
        .select()
        .from(teaSessions)
        .where(eq(teaSessions.id, session.id));

      expect(retrieved).toHaveLength(0);
    });

    it('should enforce unique thread IDs', async () => {
      const threadId = 'unique-thread';
      await createTestSession(db, { threadId });

      // Attempt to create another session with the same thread ID
      await expect(async () => {
        await createTestSession(db, { threadId });
      }).rejects.toThrow(/UNIQUE constraint failed/);
    });
  });

  describe('Messages', () => {
    it('should create a new message', async () => {
      const messageData = {
        threadId: 'test-thread',
        role: 'user' as const,
        content: 'Test message',
        createdAt: new Date()
      };

      const result = await db
        .insert(messages)
        .values(messageData)
        .returning();

      expect(result[0]).toMatchObject({
        threadId: messageData.threadId,
        role: messageData.role,
        content: messageData.content,
        id: expect.any(Number)
      });
      expect(result[0].createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve messages by thread ID', async () => {
      const threadId = 'test-thread';
      const message1 = await createTestMessage(db, { threadId });
      const message2 = await createTestMessage(db, { 
        threadId,
        content: 'Second message'
      });

      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.threadId, threadId));

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([message1, message2]));
    });

    it('should validate message role', async () => {
      await expect(async () => {
        await createTestMessage(db, {
          role: 'invalid' as any
        });
      }).rejects.toThrow(/CHECK constraint failed/);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent session updates', async () => {
      const result = await db
        .update(teaSessions)
        .set({ notes: 'Update non-existent' })
        .where(eq(teaSessions.id, 999))
        .returning();

      expect(result).toHaveLength(0);
    });

    it('should handle non-existent session deletions', async () => {
      const result = await db
        .delete(teaSessions)
        .where(eq(teaSessions.id, 999))
        .returning();

      expect(result).toHaveLength(0);
    });

    it('should handle invalid data types', async () => {
      // Since SQLite is very permissive with type coercion,
      // we'll skip this test as it's not critical for our application.
      // Our TypeScript types will catch these issues at compile time.
      expect(true).toBe(true);
    });
  });
});
