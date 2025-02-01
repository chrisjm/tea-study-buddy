<script lang="ts">
  export let isLoading = false;
  export let onSubmit: (message: string) => void;

  let inputMessage = '';

  const handleSubmit = () => {
    if (!inputMessage.trim() || isLoading) return;
    onSubmit(inputMessage.trim());
    inputMessage = '';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="flex gap-2"
>
  <textarea
    bind:value={inputMessage}
    on:keydown={handleKeyDown}
    placeholder="Type your message..."
    class="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
    rows="1"
    disabled={isLoading}
    aria-label="Message input"
  />
  <button
    type="submit"
    class="rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-2 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
    disabled={isLoading || !inputMessage.trim()}
  >
    Send
  </button>
</form>
