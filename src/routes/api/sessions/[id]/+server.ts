import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { TeaSession } from '$lib/stores/chatStore';

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
