import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSteeps } from '$lib/db/schema/teaSteeps';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

interface UpdateSteepBody {
  temperature?: number;
  steepTimeMin?: number;
  steepTimeMax?: number;
  actualSteepTime?: number;
  notes?: string;
}

export const GET: RequestHandler = async ({ params }) => {
  try {
    const sessionId = parseInt(params.id);
    const steepId = parseInt(params.steepId);

    if (isNaN(sessionId) || isNaN(steepId)) {
      throw error(400, 'Invalid session ID or steep ID');
    }

    const steep = await db
      .select()
      .from(teaSteeps)
      .where(
        and(
          eq(teaSteeps.id, steepId),
          eq(teaSteeps.teaSessionId, sessionId)
        )
      )
      .limit(1);

    if (!steep.length) {
      throw error(404, 'Steep not found');
    }

    return json({
      id: steep[0].id.toString(),
      teaSessionId: steep[0].teaSessionId.toString(),
      steepNumber: steep[0].steepNumber,
      temperature: steep[0].temperature,
      steepTimeMin: steep[0].steepTimeMin,
      steepTimeMax: steep[0].steepTimeMax,
      actualSteepTime: steep[0].actualSteepTime,
      notes: steep[0].notes,
      createdAt: steep[0].createdAt.toISOString(),
      updatedAt: steep[0].updatedAt?.toISOString()
    });
  } catch (error) {
    console.error('Error fetching tea steep:', error);
    return new Response(JSON.stringify({ error: 'Error fetching tea steep:' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const sessionId = parseInt(params.id);
    const steepId = parseInt(params.steepId);

    if (isNaN(sessionId) || isNaN(steepId)) {
      throw error(400, 'Invalid session ID or steep ID');
    }

    const body = await request.json() as UpdateSteepBody;

    // Validate numeric fields
    if (
      (body.temperature !== undefined && typeof body.temperature !== 'number') ||
      (body.steepTimeMin !== undefined && typeof body.steepTimeMin !== 'number') ||
      (body.steepTimeMax !== undefined && typeof body.steepTimeMax !== 'number') ||
      (body.actualSteepTime !== undefined && typeof body.actualSteepTime !== 'number') ||
      (body.notes !== undefined && typeof body.notes !== 'string')
    ) {
      throw error(400, 'Invalid data types in request body');
    }

    const updatedSteep = await db
      .update(teaSteeps)
      .set({
        temperature: body.temperature ?? undefined,
        steepTimeMin: body.steepTimeMin ?? undefined,
        steepTimeMax: body.steepTimeMax ?? undefined,
        actualSteepTime: body.actualSteepTime ?? undefined,
        notes: body.notes ?? undefined,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(teaSteeps.id, steepId),
          eq(teaSteeps.teaSessionId, sessionId)
        )
      )
      .returning();

    if (!updatedSteep.length) {
      throw error(404, 'Steep not found');
    }

    return json({
      id: updatedSteep[0].id.toString(),
      teaSessionId: updatedSteep[0].teaSessionId.toString(),
      steepNumber: updatedSteep[0].steepNumber,
      temperature: updatedSteep[0].temperature,
      steepTimeMin: updatedSteep[0].steepTimeMin,
      steepTimeMax: updatedSteep[0].steepTimeMax,
      actualSteepTime: updatedSteep[0].actualSteepTime,
      notes: updatedSteep[0].notes,
      createdAt: updatedSteep[0].createdAt.toISOString(),
      updatedAt: updatedSteep[0].updatedAt?.toISOString()
    });
  } catch (error) {
    console.error('Error updating tea steep:', error);
    return new Response(JSON.stringify({ error: 'Error updating tea steep:' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const sessionId = parseInt(params.id);
    const steepId = parseInt(params.steepId);

    if (isNaN(sessionId) || isNaN(steepId)) {
      throw error(400, 'Invalid session ID or steep ID');
    }

    const deletedSteep = await db
      .delete(teaSteeps)
      .where(
        and(
          eq(teaSteeps.id, steepId),
          eq(teaSteeps.teaSessionId, sessionId)
        )
      )
      .returning();

    if (!deletedSteep.length) {
      throw error(404, 'Steep not found');
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tea steep:', error);
    return new Response(JSON.stringify({ error: 'Error deleting tea steep:' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
