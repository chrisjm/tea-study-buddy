<script lang="ts">
	import type { TeaSession } from '$lib/types';
	import { onMount } from 'svelte';
	import TeaSessionItem from '$lib/components/TeaSessionItem.svelte';

	let sessions: TeaSession[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isDeleting = false;

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
					<TeaSessionItem {session} onDelete={handleDelete} {isDeleting} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
