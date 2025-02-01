<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore, type TeaSession } from '$lib/stores/chatStore';
  import TeaSessionInfo from './TeaSessionInfo.svelte';
  import MessageList from './MessageList.svelte';
  import MessageInput from './MessageInput.svelte';

  export let teaSession: TeaSession | null = null;

  $: ({ messages, isLoading, threadId } = $chatStore);

  const handleSubmit = async (message: string) => {
    chatStore.setLoading(true);
    chatStore.addMessage({ role: 'user', content: message });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          threadId: teaSession?.threadId || 'default',
          ...((!teaSession?.threadId || teaSession?.threadId === 'default') && teaSession ? { teaSession } : {})
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      chatStore.setThreadId(data.threadId);
      chatStore.addMessage({ role: 'assistant', content: data.message });
    } catch (error) {
      console.error('Error:', error);
      chatStore.addMessage({
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      });
    } finally {
      chatStore.setLoading(false);
    }
  };

  const loadThread = async () => {
    const currentThreadId = teaSession?.threadId;
    if (!currentThreadId || currentThreadId === 'default') return;

    chatStore.setLoading(true);
    try {
      const response = await fetch(`/api/threads/${currentThreadId}`);
      if (!response.ok) throw new Error('Failed to fetch thread');
      const data = await response.json();
      chatStore.setThreadId(currentThreadId);
      chatStore.setMessages(data.messages);
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      chatStore.setLoading(false);
    }
  };

  onMount(() => {
    loadThread();
    return () => {
      chatStore.reset();
    };
  });
</script>

<div class="flex flex-col h-full bg-white dark:bg-gray-800 transition-colors duration-200">
  <TeaSessionInfo {teaSession} />
  <MessageList {messages} {isLoading} />
  <div class="border-t border-gray-200 dark:border-gray-700 p-4">
    <MessageInput {isLoading} onSubmit={handleSubmit} />
  </div>
</div>
