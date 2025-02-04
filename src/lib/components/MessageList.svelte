<script lang="ts">
  import { onMount } from 'svelte';
  import type { ChatMessage } from '$lib/stores/chatStore';
  import Message from './Message.svelte';
  import LoadingIndicator from './LoadingIndicator.svelte';

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
      <Message {message} />
    {/each}
  </div>
  {#if isLoading}
    <LoadingIndicator />
  {/if}
</div>
