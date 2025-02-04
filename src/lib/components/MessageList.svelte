<script lang="ts">
  import { onMount } from 'svelte';
  import type { ChatMessage } from '$lib/stores/chatStore';
  import { marked } from 'marked';

  export let messages: ChatMessage[] = [];
  export let isLoading = false;

  let chatContainer: HTMLDivElement;
  let previousMessagesLength = 0;
  let shouldAutoScroll = true;

  const handleScroll = () => {
    if (!chatContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainer;
    // Consider "near bottom" if within 100px of the bottom
    shouldAutoScroll = scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (!chatContainer) return;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  $: if (chatContainer && messages.length > previousMessagesLength && shouldAutoScroll) {
    setTimeout(() => {
      scrollToBottom();
      previousMessagesLength = messages.length;
    }, 0);
  }

  onMount(() => {
    scrollToBottom();
  });

  function formatMessage(content: string) {
    try {
      return marked.parse(content, {
        breaks: true,
        gfm: true
      });
    } catch {
      return content;
    }
  };
</script>

<div
  bind:this={chatContainer}
  class="flex-1 overflow-y-auto bg-white dark:bg-gray-800 shadow-inner transition-colors duration-200"
  role="log"
  aria-label="Chat messages"
  on:scroll={handleScroll}
>
  <div class="flex flex-col space-y-4 p-4">
    {#each messages as message}
      <div
        class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
        role="article"
      >
        <div
          class="max-w-[80%] rounded-lg p-3 {message.role === 'user'
            ? 'bg-blue-600 text-white dark:bg-blue-700'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'} shadow-sm"
        >
          {#if message.role === 'assistant'}
            <div class="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
              {@html formatMessage(message.content)}
              {#if message.inputTokens || message.outputTokens}
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {#if message.inputTokens}
                    <span class="mr-3">Input tokens: {message.inputTokens}</span>
                  {/if}
                  {#if message.outputTokens}
                    <span>Output tokens: {message.outputTokens}</span>
                  {/if}
                </div>
              {/if}
            </div>
          {:else}
            <div class="whitespace-pre-wrap">{message.content}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  {#if isLoading}
    <div class="flex justify-start p-4">
      <div class="rounded-lg bg-gray-100 dark:bg-gray-700 p-3 shadow-sm transition-colors duration-200">
        <div class="flex gap-1" aria-label="Loading response">
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400"></div>
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style="animation-delay: 0.2s;"></div>
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500 dark:bg-gray-400" style="animation-delay: 0.4s;"></div>
        </div>
      </div>
    </div>
  {/if}
</div>
