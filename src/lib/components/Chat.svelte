<script lang="ts">
  import { onMount } from 'svelte';
  export let teaSession: {
    teaType: string;
    teaStyle: string;
    brewingTemp?: number;
    steepTime?: number;
    notes?: string;
    threadId?: string;
  } | null = null;

  let messages: { role: 'user' | 'assistant'; content: string }[] = [];
  let inputMessage = '';
  let chatContainer: HTMLDivElement;
  let isLoading = false;
  let threadId = teaSession?.threadId || 'default';

  const handleSubmit = async () => {
    if (!inputMessage.trim() || isLoading) return;

    isLoading = true;
    const userMessage = inputMessage.trim();
    inputMessage = '';

    messages = [...messages, { role: 'user', content: userMessage }];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          threadId,
          ...(threadId === 'default' && teaSession ? { teaSession } : {})
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      threadId = data.threadId;
      messages = [...messages, { role: 'assistant', content: data.message }];
    } catch (error) {
      console.error('Error:', error);
      messages = [...messages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }];
    } finally {
      isLoading = false;
    }
  };

  const loadThread = async () => {
    if (!threadId || threadId === 'default') return;

    isLoading = true;
    try {
      const response = await fetch(`/v1/threads/${threadId}`);
      if (!response.ok) throw new Error('Failed to fetch thread');
      const thread = await response.json();
      messages = thread.messages;
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    loadThread();
  });

  $: if (chatContainer && messages.length) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }
</script>

<div class="flex h-full flex-col gap-4 p-4">
  {#if teaSession}
    <div class="rounded-lg bg-green-50 p-4 text-sm text-green-800">
      <p class="font-medium">Current Tea Session</p>
      <p>Type: {teaSession.teaType} ({teaSession.teaStyle} style)</p>
      {#if teaSession.brewingTemp}
        <p>Brewing Temperature: {teaSession.brewingTemp}°C</p>
      {/if}
      {#if teaSession.steepTime}
        <p>Steep Time: {teaSession.steepTime} seconds</p>
      {/if}
      {#if teaSession.notes}
        <p>Notes: {teaSession.notes}</p>
      {/if}
    </div>
  {/if}

  <div
    bind:this={chatContainer}
    class="flex-1 space-y-4 overflow-y-auto rounded-lg bg-white p-4 shadow-inner"
  >
    {#each messages as message}
      <div
        class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
      >
        <div
          class="max-w-[80%] rounded-lg p-3 {message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'}"
        >
          {message.content}
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="flex justify-start">
        <div class="max-w-[80%] rounded-lg bg-gray-100 p-3 text-gray-800">
          <div class="flex gap-1">
            <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
            <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500" style="animation-delay: 0.2s;"></div>
            <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500" style="animation-delay: 0.4s;"></div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <form
    on:submit|preventDefault={handleSubmit}
    class="flex gap-2"
  >
    <input
      type="text"
      bind:value={inputMessage}
      placeholder="Type your message..."
      class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      disabled={isLoading}
    />
    <button
      type="submit"
      class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
      disabled={isLoading}
    >
      Send
    </button>
  </form>
</div>
