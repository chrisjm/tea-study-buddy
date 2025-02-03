import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { db } from '$lib/db';
import { teaSessions } from '$lib/db/schema/teaSessions';
import { messages } from '$lib/db/schema/messages';
import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from '$env/static/private';
import type { TeaSession } from '$lib/types';
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
    let { message: userMessage, threadId, teaSessionId } = await request.json() as {
      message: string;
      threadId: string;
      teaSessionId?: number;
    };

    let teaSession: TeaSession | undefined;

    if (teaSessionId) {
      teaSession = await db.query.teaSessions.findFirst({
        where: eq(teaSessions.id, teaSessionId)
      });
    }

    // Store the user's message in the database
    await db.insert(messages).values({
      role: 'user',
      content: userMessage,
      threadId: threadId,
      createdAt: new Date()
    });

    // Update tea session after storing user message
    if (teaSession) {
      await db.update(teaSessions)
        .set({ updatedAt: new Date() })
        .where(eq(teaSessions.id, teaSession.id));
    }

    let thread: OpenAI.Beta.Threads.Thread;

    if (!threadId || threadId === 'default') {
      thread = await openai.beta.threads.create();
      threadId = thread.id;

      if (teaSession) {
        // Update the tea session with the new thread ID and updatedAt
        await db.update(teaSessions)
          .set({
            threadId,
            updatedAt: new Date()
          })
          .where(eq(teaSessions.id, teaSession.id));
      }
    } else {
      try {
        thread = await openai.beta.threads.retrieve(threadId);

        // Update the updatedAt timestamp for existing tea sessions
        if (teaSession) {
          await db.update(teaSessions)
            .set({ updatedAt: new Date() })
            .where(eq(teaSessions.id, teaSession.id));
        }
      } catch (error) {
        throw error;
      }
    }

    let currentMessage = userMessage;
    if (teaSession) {
      currentMessage = `Context: This conversation is about a tea session with the following details:
Tea Type: ${teaSession.teaType}
Tea Style: ${teaSession.teaStyle}
${teaSession.brewingTemp ? `Brewing Temperature: ${teaSession.brewingTemp}°C` : ''}
${teaSession.steepTime ? `Steep Time: ${teaSession.steepTime} seconds` : ''}
${teaSession.notes ? `Notes: ${teaSession.notes}` : ''}

User Message: ${userMessage}`;
    }

    await openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: currentMessage
      }
    );

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: OPENAI_ASSISTANT_ID
    });

    // Update tea session after creating run
    if (teaSession) {
      await db.update(teaSessions)
        .set({ updatedAt: new Date() })
        .where(eq(teaSessions.id, teaSession.id));
    }

    let runStatus = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id
    );

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
    }

    if (runStatus.status === 'completed') {
      const threadMessages = await openai.beta.threads.messages.list(
        threadId
      );
      const lastMessage = threadMessages.data[0];

      if (lastMessage && lastMessage.content[0].type === 'text') {
        await db.insert(messages).values({
          role: 'assistant',
          content: lastMessage.content[0].text.value,
          threadId: threadId,
          createdAt: new Date()
        });

        // Update tea session after storing assistant message
        if (teaSession) {
          await db.update(teaSessions)
            .set({ updatedAt: new Date() })
            .where(eq(teaSessions.id, teaSession.id));
        }

        return json({
          message: lastMessage.content[0].text.value,
          threadId: threadId
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
