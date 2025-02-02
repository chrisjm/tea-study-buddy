<script lang="ts">
	import type { TeaSession } from '$lib/types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let sessions: TeaSession[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isDeleting = false;

	const handleSessionClick = (sessionId: string) => {
		goto(`/session/${sessionId}`);
	};

	const handleKeyDown = (event: KeyboardEvent, sessionId: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleSessionClick(sessionId);
		}
	};

	const handleDelete = async (event: Event, sessionId: string) => {
		event.stopPropagation();
		if (isDeleting) return;

		if (!confirm('Are you sure you want to delete this tea session?')) {
			return;
		}

		isDeleting = true;
		try {
			const response = await fetch(`/api/sessions/${sessionId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete session');
			}

			sessions = sessions.filter((session) => session.id !== sessionId);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to delete session';
		} finally {
			isDeleting = false;
		}
	};

	const handleDeleteKeyDown = (event: KeyboardEvent, sessionId: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleDelete(event, sessionId);
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

<div class="mx-auto w-full max-w-4xl p-4">
	{#if error}
		<div
			class="relative mb-4 rounded border border-red-400 bg-red-100 dark:border-red-500 dark:bg-red-900/50 px-4 py-3 text-red-700 dark:text-red-200"
			role="alert"
		>
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	{#if isLoading}
		<div class="flex items-center justify-center py-8">
			<div
				class="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"
			></div>
		</div>
	{:else if sessions.length === 0}
		<div class="p-4 text-center text-gray-500 dark:text-gray-400">
			No tea sessions found. Start a new one!
		</div>
	{:else}
		<ul class="space-y-4">
			{#each sessions as session (session.id)}
				<li>
					<div
						class="flex cursor-pointer items-center justify-between rounded-lg bg-white dark:bg-gray-800 p-4 shadow transition-shadow duration-200 hover:shadow-md dark:shadow-gray-900/50"
						on:click={() => handleSessionClick(session.id)}
						on:keydown={(e) => handleKeyDown(e, session.id)}
						tabindex="0"
						role="button"
						aria-label="View tea session details"
					>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{session.teaType} Tea</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300">Style: {session.teaStyle}</p>
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
							<p class="text-xs text-gray-400 dark:text-gray-500">
								{new Date(session.createdAt).toLocaleDateString()} at {new Date(
									session.createdAt
								).toLocaleTimeString()}
							</p>
						</div>
						<button
							class="rounded-full p-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-400 dark:hover:text-red-400 dark:focus:ring-red-400"
							on:click={(e) => handleDelete(e, session.id)}
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
				</li>
			{/each}
		</ul>
	{/if}
</div>
