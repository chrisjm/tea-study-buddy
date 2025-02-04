<script lang="ts">
  import type { ChatMessage } from '$lib/stores/chatStore';
  import MessageBubble from './MessageBubble.svelte';

  export let message: ChatMessage;
</script>

<div
  class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
  role="article"
>
  <MessageBubble {message} />
</div>
