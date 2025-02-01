<script lang="ts">
  export let isLoading = false;
  export let onSubmit: (message: string) => void;
  
  let inputMessage = '';
  
  const handleSubmit = () => {
    if (!inputMessage.trim() || isLoading) return;
    onSubmit(inputMessage.trim());
    inputMessage = '';
  };
</script>

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
    aria-label="Message input"
  />
  <button
    type="submit"
    class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
    disabled={isLoading}
  >
    Send
  </button>
</form>
