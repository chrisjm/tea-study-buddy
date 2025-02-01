<script lang="ts">
  import type { TeaSession } from '$lib/types';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let sessions: TeaSession[] = [];
  let isLoading = true;
  let error: string | null = null;

  const handleSessionClick = (sessionId: string) => {
    goto(`/session/${sessionId}`);
  };

  const handleKeyDown = (event: KeyboardEvent, sessionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSessionClick(sessionId);
    }
  };

  onMount(async () => {
    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      sessions = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load sessions';
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="w-full max-w-2xl mx-auto">
  {#if isLoading}
    <div class="flex justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  {:else if error}
    <div class="text-red-500 p-4 text-center" role="alert">
      {error}
    </div>
  {:else if sessions.length === 0}
    <div class="text-gray-500 p-4 text-center">
      No tea sessions found. Start a new one!
    </div>
  {:else}
    <ul class="space-y-3">
      {#each sessions as session (session.id)}
        <li>
          <div
            class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer dark:text-white"
            on:click={() => handleSessionClick(session.id)}
            on:keydown={(e) => handleKeyDown(e, session.id)}
            tabindex="0"
            role="button"
            aria-label="Open tea session with {session.teaType} tea from {new Date(session.created_at).toLocaleDateString()}"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {session.teaType} Tea
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Style: {session.teaStyle}
                </p>
                {#if session.brewingTemp || session.steepTime}
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {#if session.brewingTemp}
                      {session.brewingTemp}°C
                    {/if}
                    {#if session.brewingTemp && session.steepTime}
                      •
                    {/if}
                    {#if session.steepTime}
                      {session.steepTime}s
                    {/if}
                  </p>
                {/if}
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString()}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
