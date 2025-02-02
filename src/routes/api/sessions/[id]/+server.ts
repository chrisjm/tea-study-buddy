import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSessions, messages } from '$lib/db/schema';
import { eq } from 'drizzle-orm/sqlite-core/expressions';
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
      teaType: session[0].teaType,
      teaStyle: session[0].teaStyle,
      brewingTemp: session[0].brewingTemp ?? undefined,
      steepTime: session[0].steepTime ?? undefined,
      notes: session[0].notes ?? undefined,
      threadId: session[0].threadId ?? undefined
    };

    return json({
      id: session[0].id.toString(),
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
