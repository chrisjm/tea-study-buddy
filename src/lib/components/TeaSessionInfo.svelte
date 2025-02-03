<script lang="ts">
	import TeaSessionForm from './TeaSessionForm.svelte';
	import type { TeaSession } from '$lib/types';

	export let teaSession: TeaSession | null = null;

	let showEditForm = false;

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			showEditForm = true;
		}
	};
</script>

{#if teaSession}
	<div
		class="rounded-lg bg-gray-50 p-4 shadow-sm transition-colors duration-200 dark:bg-gray-800"
		role="region"
		aria-label="Tea session information"
	>
		<div class="mb-2 flex items-start justify-between">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
				{teaSession.teaType} Tea
			</h2>
			<button
				class="text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				on:click={() => (showEditForm = true)}
				on:keydown={handleKeyDown}
				aria-label="Edit tea session"
				tabindex="0"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
					/>
				</svg>
			</button>
		</div>
		<div class="space-y-1 text-sm">
			<p class="text-gray-600 dark:text-gray-400">
				Style: {teaSession.teaStyle}
			</p>
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
				<p class="text-gray-600 dark:text-gray-400">
					Notes: {teaSession.notes}
				</p>
			{/if}
		</div>
	</div>
{/if}

{#if showEditForm}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
	>
		<div class="w-full max-w-lg">
			<TeaSessionForm
				editMode={true}
				{teaSession}
				onClose={() => (showEditForm = false)}
			/>
		</div>
	</div>
{/if}
