<script lang="ts">
	import { goto } from '$app/navigation';

	export let onClose: () => void;

	let formData = {
		teaType: 'Oolong',
		teaStyle: 'Alishan',
		brewingTemp: null as number | null,
		steepTime: null as number | null,
		notes: ''
	};

	let error: string | null = null;

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		error = null;

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
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create session';
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClose();
		}
	};
</script>

<div
	class="rounded-lg bg-white p-6 shadow-lg transition-colors duration-200 dark:bg-gray-800"
>
	<div class="mb-4 flex items-center justify-between">
		<h2
			class="text-xl font-semibold text-gray-900 transition-colors duration-200 dark:text-white"
		>
			Start a New Tea Session
		</h2>
		<button
			on:click={onClose}
			on:keydown={handleKeyDown}
			class="text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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

	{#if error}
		<div
			class="mb-4 rounded-md bg-red-50 p-4 text-red-700 transition-colors duration-200 dark:bg-red-900/50 dark:text-red-200"
			role="alert"
		>
			{error}
		</div>
	{/if}

	<form on:submit={handleSubmit} class="space-y-4">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label
					for="teaType"
					class="mb-1 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
					>Tea Type *</label
				>
				<select
					id="teaType"
					bind:value={formData.teaType}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					required
				>
					<option value="Black">Black</option>
					<option value="Green">Green</option>
					<option value="Oolong">Oolong</option>
					<option value="Puerh">Puerh</option>
					<option value="White">White</option>
					<option value="Yellow">Yellow</option>
					<option value="Herbal">Herbal</option>
				</select>
			</div>

			<div>
				<label
					for="teaStyle"
					class="mb-1 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
					>Tea Style *</label
				>
				<input
					type="text"
					id="teaStyle"
					bind:value={formData.teaStyle}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					required
				/>
			</div>

			<div>
				<label
					for="brewingTemp"
					class="mb-1 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
					>Brewing Temperature (°F)</label
				>
				<input
					type="number"
					id="brewingTemp"
					bind:value={formData.brewingTemp}
					min="32"
					max="212"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label
					for="steepTime"
					class="mb-1 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
					>Steep Time (seconds)</label
				>
				<input
					type="number"
					id="steepTime"
					bind:value={formData.steepTime}
					min="1"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
		</div>

		<div>
			<label
				for="notes"
				class="mb-1 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
				>Notes</label
			>
			<textarea
				id="notes"
				bind:value={formData.notes}
				rows="3"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			></textarea>
		</div>

		<div class="flex justify-end space-x-3">
			<button
				type="button"
				on:click={onClose}
				on:keydown={handleKeyDown}
				class="rounded-lg px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				>Cancel</button
			>
			<button
				type="submit"
				class="rounded-lg bg-emerald-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
				>Start Session</button
			>
		</div>
	</form>
</div>
