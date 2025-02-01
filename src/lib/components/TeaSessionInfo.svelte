<script lang="ts">
  import type { TeaSession } from '$lib/stores/chatStore';
  
  export let teaSession: TeaSession | null = null;
</script>

{#if teaSession}
  <div 
    class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 shadow-sm transition-colors duration-200"
    role="region"
    aria-label="Tea session information"
  >
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {teaSession.teaType} Tea
    </h2>
    <div class="space-y-1 text-sm">
      <p class="text-gray-600 dark:text-gray-400">Style: {teaSession.teaStyle}</p>
      {#if teaSession.brewingTemp || teaSession.steepTime}
        <p class="text-gray-600 dark:text-gray-400">
          Brewing: 
          {#if teaSession.brewingTemp}
            {teaSession.brewingTemp}°C
          {/if}
          {#if teaSession.brewingTemp && teaSession.steepTime}
            •
          {/if}
          {#if teaSession.steepTime}
            {teaSession.steepTime}s
          {/if}
        </p>
      {/if}
      {#if teaSession.notes}
        <p class="text-gray-600 dark:text-gray-400">Notes: {teaSession.notes}</p>
      {/if}
    </div>
  </div>
{/if}
