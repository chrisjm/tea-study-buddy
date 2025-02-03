import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, PUT, DELETE } from './+server';
import { db } from '$lib/db';
import { teaSessions } from '$lib/db/schema';
import type { TeaSession } from '$lib/stores/chatStore';

function createMockTeaSession() {
  return {
    id: 1,
    teaType: 'Green Tea',
    teaStyle: 'Sencha',
    brewingTemp: 75,
    steepTime: 180,
    notes: 'Light and refreshing',
    threadId: 'thread-123',
    createdAt: new Date('2025-02-01T23:34:37-08:00')
  };
}

function createMockDb() {
  const mockTeaSession = createMockTeaSession();
  let currentSession = { ...mockTeaSession };

  return {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [currentSession])
        }))
      }))
    })),
    update: vi.fn(() => ({
      set: vi.fn((data) => ({
        where: vi.fn(() => {
          currentSession = {
            ...currentSession,
            ...data
          };
          return { returning: vi.fn(() => [currentSession]) };
        })
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({ 
        returning: vi.fn(() => [{ ...mockTeaSession }]) 
      }))
    }))
  };
}

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: vi.fn(() => ({
    beta: {
      threads: {
        del: vi.fn().mockResolvedValue({ id: 'thread-123', deleted: true })
      }
    }
  }))
}));

// Mock the database
vi.mock('$lib/db', () => ({ db: createMockDb() }));

describe('Session API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return a tea session', async () => {
      const response = await GET({ params: { id: '1' } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', 1);
      expect(data).toHaveProperty('teaType', 'Green Tea');
    });

    it('should handle non-existent session', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(() => [])
          }))
        }))
      }));

      const response = await GET({ params: { id: '999' } } as any);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT endpoint', () => {
    const updateData: Partial<TeaSession> = {
      notes: 'Updated notes',
      brewingTemp: 80
    };

    it('should update a tea session', async () => {
      const response = await PUT({
        params: { id: '1' },
        request: new Request('http://localhost', {
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      } as any);

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', 1);
      expect(data).toMatchObject({
        brewingTemp: updateData.brewingTemp,
        notes: updateData.notes
      });
    });
  });

  describe('DELETE endpoint', () => {
    it('should delete a tea session', async () => {
      const response = await DELETE({ params: { id: '1' } } as any);
      expect(response.status).toBe(204);
    });
  });
});
