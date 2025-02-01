import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { messages } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const threadMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, params.id))
      .orderBy(messages.createdAt);

    return json({
      messages: threadMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });
  } catch (error) {
    console.error('Error fetching thread messages:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
