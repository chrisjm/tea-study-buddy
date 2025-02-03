<script lang="ts">
	import type { TeaSession } from '$lib/types';
	import { goto } from '$app/navigation';
	import TeaSessionForm from './TeaSessionForm.svelte';

	export let session: TeaSession;
	export let onDelete: (event: Event, sessionId: number) => Promise<void>;
	export let isDeleting: boolean;

	let showEditForm = false;

	const handleSessionClick = (sessionId: number) => {
		goto(`/session/${sessionId}`);
	};

	const handleKeyDown = (event: KeyboardEvent, sessionId: number) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleSessionClick(sessionId);
		}
	};

	const handleDeleteKeyDown = (event: KeyboardEvent, sessionId: number) => {
		if (event.key === 'Enter' || event.key === ' ') {
			onDelete(event, sessionId);
		}
	};

	const handleEditClick = (event: Event) => {
		event.stopPropagation();
		showEditForm = true;
	};

	const handleEditKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			showEditForm = true;
		}
	};
</script>

<div
	class="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow transition-shadow duration-200 hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900/50"
	on:click={() => handleSessionClick(session.id)}
	on:keydown={(e) => handleKeyDown(e, session.id)}
	tabindex="0"
	role="button"
	aria-label="View tea session details"
>
	<div>
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			{session.teaType} Tea
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-300">
			Style: {session.teaStyle}
		</p>
		{#if session.brewingTemp || session.steepTime}
			<p class="text-sm text-gray-500 dark:text-gray-400">
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
		{#if session.threadId}
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Thread ID: {session.threadId}
			</p>
		{/if}
		<p class="text-xs text-gray-400 dark:text-gray-500">
			{new Date(session.createdAt).toLocaleDateString()} at {new Date(
				session.createdAt
			).toLocaleTimeString()}
		</p>
	</div>
	<div class="flex gap-2">
		<button
			class="rounded-full p-2 text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:text-blue-400 dark:focus:ring-blue-400"
			on:click={handleEditClick}
			on:keydown={handleEditKeyDown}
			tabindex="0"
			aria-label="Edit tea session"
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
		<button
			class="rounded-full p-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-400 dark:hover:text-red-400 dark:focus:ring-red-400"
			on:click={(e) => onDelete(e, session.id)}
			on:keydown={(e) => handleDeleteKeyDown(e, session.id)}
			tabindex="0"
			aria-label="Delete tea session"
			disabled={isDeleting}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
</div>

{#if showEditForm}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
	>
		<div class="w-full max-w-lg">
			<TeaSessionForm
				editMode={true}
				teaSession={session}
				onClose={() => (showEditForm = false)}
			/>
		</div>
	</div>
{/if}
