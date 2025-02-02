import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSessions, messages } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { TeaSession } from '$lib/stores/chatStore';
import { OpenAI } from 'openai';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const session = await db
      .select()
      .from(teaSessions)
      .where(eq(teaSessions.id, parseInt(params.id)))
      .limit(1);

    if (!session.length) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const teaSession: TeaSession = {
      id: session[0].id,
      teaType: session[0].teaType,
      teaStyle: session[0].teaStyle,
      brewingTemp: session[0].brewingTemp ?? undefined,
      steepTime: session[0].steepTime ?? undefined,
      notes: session[0].notes ?? undefined,
      threadId: session[0].threadId ?? undefined
    };

    return json({
      createdAt: session[0].createdAt.toISOString(),
      ...teaSession
    });
  } catch (error) {
    console.error('Error fetching tea session:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const sessionId = params.id;
    const updateData = await request.json();

    // Validate the session exists
    const existingSession = await db
      .select()
      .from(teaSessions)
      .where(eq(teaSessions.id, sessionId))
      .limit(1);

    if (!existingSession.length) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert and validate numeric values
    const brewingTemp = updateData.brewingTemp ? parseInt(String(updateData.brewingTemp)) : null;
    const steepTime = updateData.steepTime ? parseInt(String(updateData.steepTime)) : null;

    // Validate numeric values
    if ((brewingTemp !== null && !Number.isFinite(brewingTemp)) ||
      (steepTime !== null && !Number.isFinite(steepTime))) {
      return new Response(JSON.stringify({ error: 'Invalid numeric values provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatePayload = {
      teaType: updateData.teaType,
      teaStyle: updateData.teaStyle,
      brewingTemp,
      steepTime,
      notes: updateData.notes ?? null,
      updatedAt: new Date()
    };

    // Update the session
    await db
      .update(teaSessions)
      .set(updatePayload)
      .where(eq(teaSessions.id, sessionId));

    // Fetch the updated session
    const updatedSession = await db
      .select()
      .from(teaSessions)
      .where(eq(teaSessions.id, sessionId))
      .limit(1);

    const teaSession: TeaSession = {
      id: updatedSession[0].id,
      teaType: updatedSession[0].teaType,
      teaStyle: updatedSession[0].teaStyle,
      brewingTemp: updatedSession[0].brewingTemp ?? undefined,
      steepTime: updatedSession[0].steepTime ?? undefined,
      notes: updatedSession[0].notes ?? undefined,
      threadId: updatedSession[0].threadId ?? undefined
    };

    return json({
      createdAt: updatedSession[0].createdAt.toISOString(),
      updatedAt: updatedSession[0].updatedAt?.toISOString(),
      ...teaSession
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const sessionId = parseInt(params.id);

    // Get the session first to get the threadId
    const session = await db
      .select()
      .from(teaSessions)
      .where(eq(teaSessions.id, sessionId))
      .limit(1);

    if (!session.length) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const threadId = session[0].threadId;

    // Delete associated messages
    if (threadId) {
      await db
        .delete(messages)
        .where(eq(messages.threadId, threadId));
    }

    // Delete the session
    await db
      .delete(teaSessions)
      .where(eq(teaSessions.id, sessionId));

    // Delete the OpenAI thread
    if (threadId) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      await openai.beta.threads.del(threadId);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
