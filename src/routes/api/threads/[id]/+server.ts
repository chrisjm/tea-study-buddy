import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { messages, teaSessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export const GET: RequestHandler = async ({ params }) => {
  try {
    const sessionId = parseInt(params.id);

    // Get the tea session
    const session = await db.query.teaSessions.findFirst({
      where: eq(teaSessions.id, sessionId)
    });

    if (!session) {
      return new Response(JSON.stringify({ error: 'Tea session not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let threadId = session.threadId;

    // If no thread exists, create one
    if (!threadId || threadId === 'default') {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;

      // Update the tea session with the new thread ID
      await db.update(teaSessions)
        .set({ threadId })
        .where(eq(teaSessions.id, sessionId));
    }

    const threadMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(messages.createdAt);

    return json({
      threadId,
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
