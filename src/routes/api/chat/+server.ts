import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { db } from '$lib/db';
import { teaSessions, messages } from '$lib/db/schema';
import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from '$env/static/private';
import type { TeaSession } from '$lib/stores/chatStore';
import { eq } from 'drizzle-orm/sqlite-core/expressions';

// Validate environment variables
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

if (!OPENAI_ASSISTANT_ID) {
  throw new Error('OPENAI_ASSISTANT_ID is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message: initialMessage, threadId, teaSessionId } = await request.json() as {
      message: string;
      threadId: string;
      teaSessionId?: string;
    };

    let teaSession: TeaSession | null = null;

    if (teaSessionId) {
      teaSession = await db.query.teaSessions.findFirst({
        where: eq(teaSessions.id, teaSessionId)
      });
    }

    // Store the user's message in the database
    await db.insert(messages).values({
      role: 'user',
      content: initialMessage,
      threadId: threadId || null,
      createdAt: new Date()
    });

    let thread: OpenAI.Beta.Threads.Thread;

    if (!threadId) {
      thread = await openai.beta.threads.create();

      if (teaSession) {
        // Update the tea session with the new thread ID
        await db.update(teaSessions)
          .set({ threadId: thread.id })
          .where(eq(teaSessions.id, teaSession.id));
      }
    } else {
      thread = await openai.beta.threads.retrieve(threadId);
    }

    let currentMessage = initialMessage;
    if (teaSession) {
      currentMessage = `Context: This conversation is about a tea session with the following details:
Tea Type: ${teaSession.teaType}
Tea Style: ${teaSession.teaStyle}
${teaSession.brewingTemp ? `Brewing Temperature: ${teaSession.brewingTemp}°C` : ''}
${teaSession.steepTime ? `Steep Time: ${teaSession.steepTime} seconds` : ''}
${teaSession.notes ? `Notes: ${teaSession.notes}` : ''}

User Message: ${initialMessage}`;
    }

    await openai.beta.threads.messages.create(
      threadId || thread.id,
      {
        role: 'user',
        content: currentMessage
      }
    );

    const run = await openai.beta.threads.runs.create(threadId || thread.id, {
      assistant_id: OPENAI_ASSISTANT_ID
    });

    let runStatus = await openai.beta.threads.runs.retrieve(
      threadId || thread.id,
      run.id
    );

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        threadId || thread.id,
        run.id
      );
    }

    if (runStatus.status === 'completed') {
      const threadMessages = await openai.beta.threads.messages.list(
        threadId || thread.id
      );
      const lastMessage = threadMessages.data[0];

      if (lastMessage) {
        await db.insert(messages).values({
          role: 'assistant',
          content: lastMessage.content[0].text.value,
          threadId: threadId || thread.id,
          createdAt: new Date()
        });

        return json({
          message: lastMessage.content[0].text.value,
          threadId: threadId || thread.id
        });
      }
      return json({ error: 'No response from assistant' }, { status: 500 });
    } else {
      console.error('Run failed or timed out:', runStatus);
      throw new Error('Failed to get response from assistant');
    }
  } catch (error) {
    console.error('Error in chat endpoint:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
