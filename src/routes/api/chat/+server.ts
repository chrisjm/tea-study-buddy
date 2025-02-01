import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { db } from '$lib/db';
import { teaSessions, messages } from '$lib/db/schema';
import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from '$env/static/private';

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

// Debug log for assistant ID
console.log('Using Assistant ID:', OPENAI_ASSISTANT_ID);

interface TeaSession {
  teaType: string;
  teaStyle: string;
  brewingTemp?: number;
  steepTime?: number;
  notes?: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log('Starting chat request processing...');
    
    const { message: initialMessage, threadId, teaSession } = await request.json() as {
      message: string;
      threadId: string;
      teaSession?: TeaSession;
    };

    console.log('Received request:', { threadId, hasTeaSession: !!teaSession });

    let currentMessage = initialMessage;

    // Store user message in database
    await db.insert(messages).values({
      content: currentMessage,
      role: 'user',
      threadId
    });

    console.log('Stored user message in database');

    // If no existing thread, create one and handle tea session
    let thread;
    if (threadId === 'default') {
      console.log('Creating new thread...');
      thread = await openai.beta.threads.create();
      console.log('Created new thread:', thread.id);

      // If tea session info is provided, store it and include in initial message
      if (teaSession) {
        console.log('Storing tea session:', teaSession);
        await db.insert(teaSessions).values({
          threadId: thread.id,
          teaType: teaSession.teaType,
          teaStyle: teaSession.teaStyle,
          brewingTemp: teaSession.brewingTemp,
          steepTime: teaSession.steepTime,
          notes: teaSession.notes
        });

        // Enhance the first message with tea context
        const teaContext = `I am drinking ${teaSession.teaType} tea (${teaSession.teaStyle} style)` +
          (teaSession.brewingTemp ? ` brewed at ${teaSession.brewingTemp}°C` : '') +
          (teaSession.steepTime ? ` for ${teaSession.steepTime} seconds` : '') +
          (teaSession.notes ? `. Additional notes: ${teaSession.notes}` : '') +
          '. ';

        currentMessage = teaContext + currentMessage;
        console.log('Enhanced message with tea context:', currentMessage);
      }
    } else {
      thread = { id: threadId };
      console.log('Using existing thread:', threadId);
    }

    // Add the user's message to the thread
    console.log('Adding message to thread...');
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: currentMessage
    });
    console.log('Message added to thread');

    // Run the assistant
    console.log('Starting assistant run with ID:', OPENAI_ASSISTANT_ID);
    try {
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: OPENAI_ASSISTANT_ID
      });
      console.log('Created run:', run.id);

      // Wait for the assistant to complete its response
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Initial run status:', runStatus.status);

      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log('Updated run status:', runStatus.status);
      }

      if (runStatus.status === 'completed') {
        // Get the assistant's response
        console.log('Run completed, fetching messages...');
        const threads = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = threads.data[0];

        if (lastMessage.role === 'assistant') {
          console.log('Received assistant response');
          // Store assistant message in database
          await db.insert(messages).values({
            content: lastMessage.content[0].text.value,
            role: 'assistant',
            threadId: thread.id
          });

          return json({
            message: lastMessage.content[0].text.value,
            threadId: thread.id
          });
        }
      } else {
        console.error('Run failed or timed out:', runStatus);
        throw new Error(`Assistant run failed with status: ${runStatus.status}`);
      }
    } catch (error: any) {
      console.error('Error in OpenAI API call:', {
        error: error.message,
        details: error.response?.data || error
      });
      throw error;
    }

    throw new Error('Failed to get response from assistant');
  } catch (error: any) {
    console.error('Error in chat endpoint:', {
      error: error.message,
      details: error.response?.data || error
    });
    return new Response(
      JSON.stringify({
        error: 'Error processing chat message',
        details: error.message,
        response: error.response?.data
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
