import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { teaSessions } from '$lib/db/schema/teaSessions';
import { desc } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
  try {
    const sessions = await db
      .select()
      .from(teaSessions)
      .orderBy(desc(teaSessions.createdAt));

    return json(sessions.map(session => ({
      id: session.id.toString(),
      threadId: session.threadId,
      createdAt: session.createdAt.toISOString(),
      teaType: session.teaType,
      teaStyle: session.teaStyle,
      brewingTemp: session.brewingTemp,
      steepTime: session.steepTime,
      notes: session.notes
    })));
  } catch (error) {
    console.error('Error fetching tea sessions:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    const newSession = await db
      .insert(teaSessions)
      .values({
        threadId: body.threadId,
        teaType: body.teaType,
        teaStyle: body.teaStyle,
        brewingTemp: body.brewingTemp || null,
        steepTime: body.steepTime || null,
        notes: body.notes || null,
        createdAt: new Date()
      })
      .returning();

    return json({
      id: newSession[0].id.toString(),
      threadId: newSession[0].threadId,
      createdAt: newSession[0].createdAt.toISOString(),
      teaType: newSession[0].teaType,
      teaStyle: newSession[0].teaStyle,
      brewingTemp: newSession[0].brewingTemp,
      steepTime: newSession[0].steepTime,
      notes: newSession[0].notes
    });
  } catch (error) {
    console.error('Error creating tea session:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
