<script lang="ts">
	import type { TeaSession } from '$lib/types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Chat from '$lib/components/Chat.svelte';
	import { goto } from '$app/navigation';

	let session: TeaSession | null = null;
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(`/api/sessions/${$page.params.id}`);
			if (!response.ok) throw new Error('Failed to fetch session');
			const data = await response.json();
			session = {
				id: data.id,
				teaType: data.teaType,
				teaStyle: data.teaStyle,
				brewingTemp: data.brewingTemp,
				steepTime: data.steepTime,
				notes: data.notes,
				threadId: data.threadId,
				createdAt: data.createdAt
			};
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load session';
			console.error('Error loading session:', e);
		} finally {
			isLoading = false;
		}
	});

	const handleBack = () => {
		goto('/');
	};
</script>

<div class="container mx-auto flex h-screen flex-col px-4 py-4">
	<header class="mb-4 flex items-center justify-between">
		<button
			on:click={handleBack}
			class="flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
			aria-label="Back to sessions"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-2 h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
			Back to Sessions
		</button>
	</header>

	{#if isLoading}
		<div class="flex flex-1 items-center justify-center">
			<div
				class="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500 dark:border-emerald-400"
			></div>
		</div>
	{:else if error}
		<div class="flex flex-1 items-center justify-center">
			<div class="text-center text-red-500 dark:text-red-400">
				<p class="mb-4">{error}</p>
				<button
					on:click={handleBack}
					class="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
				>
					Return to Sessions
				</button>
			</div>
		</div>
	{:else if session}
		<div
			class="flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-colors duration-200 dark:bg-gray-800"
		>
			<div class="flex-1 overflow-hidden">
				<Chat teaSession={session} />
			</div>
		</div>
	{/if}
</div>
