<script lang="ts">
  import { onMount } from 'svelte';
  import type { ChatMessage } from '$lib/stores/chatStore';
  import { marked } from 'marked';

  export let messages: ChatMessage[] = [];
  export let isLoading = false;

  let chatContainer: HTMLDivElement;

  const parseMarkdown = (content: string) => {
    try {
      return marked(content, {
        breaks: true,
        gfm: true
      });
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  };

  $: if (chatContainer && messages.length) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }
</script>

<div
  bind:this={chatContainer}
  class="flex-1 space-y-4 overflow-y-auto rounded-lg bg-white p-4 shadow-inner"
  role="log"
  aria-label="Chat messages"
>
  {#each messages as message}
    <div
      class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
      role="article"
    >
      <div
        class="max-w-[80%] rounded-lg p-3 {message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-800'}"
      >
        {#if message.role === 'assistant'}
          <div class="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-800 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:my-0 prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1">
            {@html parseMarkdown(message.content)}
          </div>
        {:else}
          {message.content}
        {/if}
      </div>
    </div>
  {/each}
  {#if isLoading}
    <div class="flex justify-start">
      <div class="max-w-[80%] rounded-lg bg-gray-100 p-3 text-gray-800">
        <div class="flex gap-1" aria-label="Loading response">
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500" style="animation-delay: 0.2s;"></div>
          <div class="h-2 w-2 animate-bounce rounded-full bg-gray-500" style="animation-delay: 0.4s;"></div>
        </div>
      </div>
    </div>
  {/if}
</div>
