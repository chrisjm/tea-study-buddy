<script lang="ts">
  import type { TeaSession } from '$lib/stores/chatStore';
  
  export let teaSession: TeaSession | null = null;
</script>

{#if teaSession}
  <div 
    class="rounded-lg bg-green-50 p-4 text-sm text-green-800"
    role="region"
    aria-label="Tea session information"
  >
    <p class="font-medium">Current Tea Session</p>
    <p>Type: {teaSession.teaType} ({teaSession.teaStyle} style)</p>
    {#if teaSession.brewingTemp}
      <p>Brewing Temperature: {teaSession.brewingTemp}°C</p>
    {/if}
    {#if teaSession.steepTime}
      <p>Steep Time: {teaSession.steepTime} seconds</p>
    {/if}
    {#if teaSession.notes}
      <p>Notes: {teaSession.notes}</p>
    {/if}
  </div>
{/if}
