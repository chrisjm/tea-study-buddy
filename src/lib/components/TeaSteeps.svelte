<script lang="ts">
	import type { TeaSteep } from '$lib/types';
	import { onMount } from 'svelte';

	export let sessionId: number;

	let steeps: TeaSteep[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isAddingSteep = false;

	// Form data for new steep
	let newSteep = {
		temperature: null as number | null,
		steepTimeMin: null as number | null,
		steepTimeMax: null as number | null,
		actualSteepTime: null as number | null,
		notes: null as string | null
	};

	onMount(async () => {
		await loadSteeps();
	});

	async function loadSteeps() {
		try {
			const response = await fetch(`/api/sessions/${sessionId}/steeps`);
			if (!response.ok) throw new Error('Failed to fetch steeps');
			steeps = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load steeps';
			console.error('Error loading steeps:', e);
		} finally {
			isLoading = false;
		}
	}

	async function handleAddSteep() {
		try {
			const response = await fetch(`/api/sessions/${sessionId}/steeps`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newSteep)
			});

			if (!response.ok) throw new Error('Failed to add steep');

			const addedSteep = await response.json();
			steeps = [...steeps, addedSteep];
			isAddingSteep = false;
			newSteep = {
				temperature: null,
				steepTimeMin: null,
				steepTimeMax: null,
				actualSteepTime: null,
				notes: null
			};
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to add steep';
			console.error('Error adding steep:', e);
		}
	}

	function formatTime(minutes: number | null): string {
		if (minutes === null) return '-';
		return `${minutes} min`;
	}
</script>

<div class="flex flex-col space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
			Steeps
		</h2>
		<button
			on:click={() => (isAddingSteep = true)}
			class="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
			aria-label="Add new steep"
		>
			Add Steep
		</button>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center py-4">
			<div
				class="h-6 w-6 animate-spin rounded-full border-b-2 border-emerald-500 dark:border-emerald-400"
			></div>
		</div>
	{:else if error}
		<div
			class="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/50 dark:text-red-200"
		>
			{error}
		</div>
	{:else if steeps.length === 0}
		<div
			class="rounded-md bg-gray-50 p-4 text-center text-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
		>
			No steeps recorded yet
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each steeps as steep (steep.id)}
				<div
					class="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="mb-2 flex items-center justify-between">
						<span class="text-sm font-medium text-gray-600 dark:text-gray-400"
							>Steep #{steep.steepNumber}</span
						>
						<span class="text-xs text-gray-500 dark:text-gray-500"
							>{new Date(steep.createdAt).toLocaleTimeString()}</span
						>
					</div>
					<div class="space-y-2">
						{#if steep.temperature}
							<div class="text-sm">
								<span class="font-medium text-gray-700 dark:text-gray-300"
									>Temperature:</span
								>
								<span class="ml-2 text-gray-600 dark:text-gray-400"
									>{steep.temperature}°C</span
								>
							</div>
						{/if}
						{#if steep?.steepTimeMin || steep?.steepTimeMax}
							<div class="text-sm">
								<span class="font-medium text-gray-700 dark:text-gray-300"
									>Steep Time:</span
								>
								<span class="ml-2 text-gray-600 dark:text-gray-400"
									>{formatTime(steep?.steepTimeMin || 0)} - {formatTime(
										steep?.steepTimeMax || 0
									)}</span
								>
							</div>
						{/if}
						{#if steep?.actualSteepTime}
							<div class="text-sm">
								<span class="font-medium text-gray-700 dark:text-gray-300"
									>Actual Time:</span
								>
								<span class="ml-2 text-gray-600 dark:text-gray-400"
									>{formatTime(steep.actualSteepTime)}</span
								>
							</div>
						{/if}
						{#if steep.notes}
							<div class="text-sm">
								<span class="font-medium text-gray-700 dark:text-gray-300"
									>Notes:</span
								>
								<p class="mt-1 text-gray-600 dark:text-gray-400">
									{steep.notes}
								</p>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if isAddingSteep}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:w-96"
				role="dialog"
				aria-modal="true"
			>
				<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
					Add New Steep
				</h3>
				<form on:submit|preventDefault={handleAddSteep} class="space-y-4">
					<div>
						<label
							for="temperature"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Temperature (°C)</label
						>
						<input
							type="number"
							id="temperature"
							bind:value={newSteep.temperature}
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 sm:text-sm"
						/>
					</div>
					<div>
						<label
							for="steepTimeMin"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Minimum Steep Time (min)</label
						>
						<input
							type="number"
							id="steepTimeMin"
							bind:value={newSteep.steepTimeMin}
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 sm:text-sm"
						/>
					</div>
					<div>
						<label
							for="steepTimeMax"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Maximum Steep Time (min)</label
						>
						<input
							type="number"
							id="steepTimeMax"
							bind:value={newSteep.steepTimeMax}
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 sm:text-sm"
						/>
					</div>
					<div>
						<label
							for="actualSteepTime"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Actual Steep Time (min)</label
						>
						<input
							type="number"
							id="actualSteepTime"
							bind:value={newSteep.actualSteepTime}
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 sm:text-sm"
						/>
					</div>
					<div>
						<label
							for="notes"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Notes</label
						>
						<textarea
							id="notes"
							bind:value={newSteep.notes}
							rows="3"
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 sm:text-sm"
						></textarea>
					</div>
					<div class="mt-4 flex justify-end space-x-3">
						<button
							type="button"
							on:click={() => (isAddingSteep = false)}
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							>Cancel</button
						>
						<button
							type="submit"
							class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-700"
							>Add Steep</button
						>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
