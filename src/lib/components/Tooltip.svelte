<script lang="ts">
  export let text: string;
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
</script>

<div class="group relative inline-block">
  <slot />
  <div
    class="pointer-events-none absolute z-10 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-gray-700 {positionClasses[position]} group-hover:block"
    role="tooltip"
  >
    {text}
    <div
      class="absolute {position === 'top'
        ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700'
        : position === 'bottom'
        ? 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700'
        : position === 'left'
        ? 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700'
        : 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700'}"
    ></div>
  </div>
</div>
