<script lang="ts">
  export let inputTokens: number | undefined = undefined;
  export let outputTokens: number | undefined = undefined;
</script>

{#if inputTokens || outputTokens}
  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
    {#if inputTokens}
      <span class="mr-3">Input tokens: {inputTokens}</span>
    {/if}
    {#if outputTokens}
      <span>Output tokens: {outputTokens}</span>
    {/if}
  </div>
{/if}
