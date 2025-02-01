<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/themeStore';
	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
	{@render children()}
</div>
