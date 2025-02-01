<script lang="ts">
	import TeaSessionList from '$lib/components/TeaSessionList.svelte';
	import { goto } from '$app/navigation';

	let showForm = false;
	let formData = {
		teaType: 'Oolong',
		teaStyle: 'Alishan',
		brewingTemp: null as number | null,
		steepTime: null as number | null,
		notes: ''
	};

	const handleStartSession = async (event: SubmitEvent) => {
		event.preventDefault();

		try {
			const response = await fetch('/api/sessions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Failed to create session');
			}

			const session = await response.json();
			goto(`/session/${session.id}`);
		} catch (error) {
			console.error('Error creating session:', error);
			// You might want to show an error message to the user here
		}
	};

	const handleFormToggle = () => {
		showForm = !showForm;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleFormToggle();
		}
	};
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
		Tea Study Buddy
	</h1>

	<div class="space-y-8">
		{#if !showForm}
			<section aria-label="Tea sessions list">
				<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
					Your Tea Sessions
				</h2>
				<TeaSessionList />
			</section>

			<section class="text-center" aria-label="New session controls">
				<button
					on:click={handleFormToggle}
					on:keydown={handleKeyDown}
					class="inline-block rounded-lg px-6 py-3 text-white transition-colors duration-200"
					class:bg-emerald-500={!showForm}
					class:hover:bg-emerald-600={!showForm}
					class:dark:bg-emerald-600={!showForm}
					class:dark:hover:bg-emerald-700={!showForm}
					tabindex="0"
					role="button"
					aria-label="Start new tea session"
				>
					Start New Tea Session
				</button>
			</section>
		{:else}
			<div class="mx-auto max-w-2xl">
				<div class="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg transition-colors duration-200">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
							Start a New Tea Session
						</h2>
						<button
							on:click={handleFormToggle}
							on:keydown={handleKeyDown}
							class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
							aria-label="Close form"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<form on:submit={handleStartSession} class="space-y-4">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label for="teaType" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
									>Tea Type *</label
								>
								<input
									type="text"
									id="teaType"
									bind:value={formData.teaType}
									class="w-full rounded-lg border px-4 py-2 transition-colors duration-200"
									class:border-gray-300={!showForm}
									class:dark:border-gray-600={!showForm}
									class:bg-white={!showForm}
									class:dark:bg-gray-700={!showForm}
									class:text-gray-900={!showForm}
									class:dark:text-white={!showForm}
									class:focus:border-emerald-500={!showForm}
									class:dark:focus:border-emerald-400={!showForm}
									class:focus:ring-emerald-500={!showForm}
									class:dark:focus:ring-emerald-400={!showForm}
									required
									aria-required="true"
								/>
							</div>
							<div>
								<label for="teaStyle" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
									>Tea Style *</label
								>
								<input
									type="text"
									id="teaStyle"
									bind:value={formData.teaStyle}
									class="w-full rounded-lg border px-4 py-2 transition-colors duration-200"
									class:border-gray-300={!showForm}
									class:dark:border-gray-600={!showForm}
									class:bg-white={!showForm}
									class:dark:bg-gray-700={!showForm}
									class:text-gray-900={!showForm}
									class:dark:text-white={!showForm}
									class:focus:border-emerald-500={!showForm}
									class:dark:focus:border-emerald-400={!showForm}
									class:focus:ring-emerald-500={!showForm}
									class:dark:focus:ring-emerald-400={!showForm}
									required
									aria-required="true"
								/>
							</div>
							<div>
								<label for="brewingTemp" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
									Brewing Temperature (°C)
								</label>
								<input
									type="number"
									id="brewingTemp"
									bind:value={formData.brewingTemp}
									class="w-full rounded-lg border px-4 py-2 transition-colors duration-200"
									class:border-gray-300={!showForm}
									class:dark:border-gray-600={!showForm}
									class:bg-white={!showForm}
									class:dark:bg-gray-700={!showForm}
									class:text-gray-900={!showForm}
									class:dark:text-white={!showForm}
									class:focus:border-emerald-500={!showForm}
									class:dark:focus:border-emerald-400={!showForm}
									class:focus:ring-emerald-500={!showForm}
									class:dark:focus:ring-emerald-400={!showForm}
									min="0"
									max="100"
									step="1"
									aria-label="Brewing temperature in Celsius"
								/>
							</div>
							<div>
								<label for="steepTime" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
									Steep Time (seconds)
								</label>
								<input
									type="number"
									id="steepTime"
									bind:value={formData.steepTime}
									class="w-full rounded-lg border px-4 py-2 transition-colors duration-200"
									class:border-gray-300={!showForm}
									class:dark:border-gray-600={!showForm}
									class:bg-white={!showForm}
									class:dark:bg-gray-700={!showForm}
									class:text-gray-900={!showForm}
									class:dark:text-white={!showForm}
									class:focus:border-emerald-500={!showForm}
									class:dark:focus:border-emerald-400={!showForm}
									class:focus:ring-emerald-500={!showForm}
									class:dark:focus:ring-emerald-400={!showForm}
									min="0"
									step="1"
									aria-label="Steep time in seconds"
								/>
							</div>
						</div>
						<div>
							<label for="notes" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Notes</label>
							<textarea
								id="notes"
								bind:value={formData.notes}
								rows="3"
								class="w-full rounded-lg border px-4 py-2 transition-colors duration-200"
								class:border-gray-300={!showForm}
								class:dark:border-gray-600={!showForm}
								class:bg-white={!showForm}
								class:dark:bg-gray-700={!showForm}
								class:text-gray-900={!showForm}
								class:dark:text-white={!showForm}
								class:focus:border-emerald-500={!showForm}
								class:dark:focus:border-emerald-400={!showForm}
								class:focus:ring-emerald-500={!showForm}
								class:dark:focus:ring-emerald-400={!showForm}
								aria-label="Additional notes about the tea session"
							></textarea>
						</div>
						<div class="flex justify-end space-x-3">
							<button
								type="button"
								on:click={handleFormToggle}
								on:keydown={handleKeyDown}
								class="px-4 py-2 transition-colors duration-200"
								class:text-gray-700={!showForm}
								class:dark:text-gray-300={!showForm}
								class:hover:text-gray-900={!showForm}
								class:dark:hover:text-white={!showForm}
								aria-label="Cancel new session"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded-lg px-6 py-2 text-white transition-colors duration-200"
								class:bg-emerald-500={!showForm}
								class:dark:bg-emerald-600={!showForm}
								class:hover:bg-emerald-600={!showForm}
								class:dark:hover:bg-emerald-700={!showForm}
								aria-label="Create new tea session"
							>
								Start Session
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
