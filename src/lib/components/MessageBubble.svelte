<script lang="ts">
  import { formatMessage } from '$lib/utils/messageUtils';
  import TokenInfo from './TokenInfo.svelte';
  import type { ChatMessage } from '$lib/stores/chatStore';

  export let message: ChatMessage;
</script>

<div
  class="relative max-w-[80%] rounded-lg p-3 {message.role === 'user'
    ? 'bg-blue-600 text-white dark:bg-blue-700'
    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'} shadow-sm"
>
  {#if message.role === 'assistant'}
    {#if message.inputTokens || message.outputTokens}
      <div class="absolute right-2 top-2">
        <TokenInfo inputTokens={message.inputTokens} outputTokens={message.outputTokens} />
      </div>
    {/if}
    <div class="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
      {@html formatMessage(message.content)}
    </div>
  {:else}
    <div class="whitespace-pre-wrap">{message.content}</div>
  {/if}
</div>
