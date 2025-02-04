<script lang="ts">
  import Tooltip from './Tooltip.svelte';

  export let inputTokens: number | undefined = undefined;
  export let outputTokens: number | undefined = undefined;

  $: tooltipText = [
    inputTokens && `Input tokens: ${inputTokens}`,
    outputTokens && `Output tokens: ${outputTokens}`
  ]
    .filter(Boolean)
    .join(' • ');
</script>

{#if inputTokens || outputTokens}
  <div class="mt-2 inline-flex items-center text-gray-500 dark:text-gray-400">
    <Tooltip text={tooltipText}>
      <button
        class="flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
        aria-label="View token information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </Tooltip>
  </div>
{/if}
