import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSteeps } from '$lib/db/schema/teaSteeps';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

interface SteepRequestBody {
  temperature?: number;
  steepTimeMin?: number;
  steepTimeMax?: number;
  actualSteepTime?: number;
  notes?: string;
}

export const GET: RequestHandler = async ({ params }) => {
  try {
    const sessionId = parseInt(params.id);
    if (isNaN(sessionId)) {
      throw error(400, 'Invalid session ID');
    }

    // Check if the session exists first
    const steeps = await db
      .select()
      .from(teaSteeps)
      .where(eq(teaSteeps.teaSessionId, sessionId))
      .orderBy(teaSteeps.steepNumber);

    // Always return an array, even if empty
    return json(steeps.map(steep => ({
      id: steep.id.toString(),
      teaSessionId: steep.teaSessionId.toString(),
      steepNumber: steep.steepNumber,
      temperature: steep.temperature,
      steepTimeMin: steep.steepTimeMin,
      steepTimeMax: steep.steepTimeMax,
      actualSteepTime: steep.actualSteepTime,
      notes: steep.notes,
      createdAt: steep.createdAt.toISOString(),
      updatedAt: steep.updatedAt?.toISOString()
    })));
  } catch (e) {
    // Only throw an error for invalid session ID, otherwise return an empty array
    if (e instanceof Error && e.message === 'Invalid session ID') {
      throw error(400, e.message);
    }
    console.error('Error fetching steeps:', e);
    return json([]);
  }
};

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const sessionId = parseInt(params.id);
    if (isNaN(sessionId)) {
      throw error(400, 'Invalid session ID');
    }

    const body = await request.json() as SteepRequestBody;

    // Get the current highest steep number for this session
    const existingSteeps = await db
      .select({ steepNumber: teaSteeps.steepNumber })
      .from(teaSteeps)
      .where(eq(teaSteeps.teaSessionId, sessionId))
      .orderBy(teaSteeps.steepNumber);

    const nextSteepNumber = existingSteeps.length > 0
      ? Math.max(...existingSteeps.map(s => s.steepNumber)) + 1
      : 1;

    const newSteep = await db
      .insert(teaSteeps)
      .values({
        teaSessionId: sessionId,
        steepNumber: nextSteepNumber,
        temperature: body.temperature ?? null,
        steepTimeMin: body.steepTimeMin ?? null,
        steepTimeMax: body.steepTimeMax ?? null,
        actualSteepTime: body.actualSteepTime ?? null,
        notes: body.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return json({
      id: newSteep[0].id.toString(),
      teaSessionId: newSteep[0].teaSessionId.toString(),
      steepNumber: newSteep[0].steepNumber,
      temperature: newSteep[0].temperature,
      steepTimeMin: newSteep[0].steepTimeMin,
      steepTimeMax: newSteep[0].steepTimeMax,
      actualSteepTime: newSteep[0].actualSteepTime,
      notes: newSteep[0].notes,
      createdAt: newSteep[0].createdAt.toISOString(),
      updatedAt: newSteep[0].updatedAt?.toISOString()
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating tea steep:' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
