<script lang="ts">
  import type { TeaSession } from '$lib/stores/chatStore';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Chat from '$lib/components/Chat.svelte';
  import { goto } from '$app/navigation';

  let session: TeaSession | null = null;
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`/api/sessions/${$page.params.id}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      const data = await response.json();
      session = {
        teaType: data.teaType,
        teaStyle: data.teaStyle,
        brewingTemp: data.brewingTemp,
        steepTime: data.steepTime,
        notes: data.notes,
        threadId: data.threadId
      };
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load session';
      console.error('Error loading session:', e);
    } finally {
      isLoading = false;
    }
  });

  const handleBack = () => {
    goto('/');
  };
</script>

<div class="container mx-auto px-4 py-8 h-screen flex flex-col">
  <header class="mb-6 flex items-center justify-between">
    <button
      on:click={handleBack}
      class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      aria-label="Back to sessions"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Back to Sessions
    </button>
  </header>

  {#if isLoading}
    <div class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 dark:border-emerald-400"></div>
    </div>
  {:else if error}
    <div class="flex-1 flex items-center justify-center">
      <div class="text-red-500 dark:text-red-400 text-center">
        <p class="mb-4">{error}</p>
        <button
          on:click={handleBack}
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          Return to Sessions
        </button>
      </div>
    </div>
  {:else if session}
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
      <div class="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{session.teaType} Tea Session</h1>
        <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
          <span>{session.teaStyle}</span>
          {#if session.brewingTemp || session.steepTime}
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span>
              {#if session.brewingTemp}
                {session.brewingTemp}°C
              {/if}
              {#if session.brewingTemp && session.steepTime}
                •
              {/if}
              {#if session.steepTime}
                {session.steepTime}s
              {/if}
            </span>
          {/if}
        </div>
        {#if session.notes}
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{session.notes}</p>
        {/if}
      </div>

      <div class="flex-1 overflow-hidden">
        <Chat teaSession={session} />
      </div>
    </div>
  {/if}
</div>
