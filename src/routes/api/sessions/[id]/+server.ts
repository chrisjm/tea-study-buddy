import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const session = await db
      .select()
      .from(teaSessions)
      .where(eq(teaSessions.id, parseInt(params.id)))
      .limit(1);

    if (!session.length) {
      return new Response('Session not found', { status: 404 });
    }

    return json({
      id: session[0].id.toString(),
      thread_id: session[0].threadId,
      created_at: session[0].created_at.toISOString(),
      tea_type: session[0].teaType,
      tea_style: session[0].teaStyle,
      brewing_temp: session[0].brewingTemp,
      steep_time: session[0].steepTime,
      notes: session[0].notes
    });
  } catch (error) {
    console.error('Error fetching tea session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
