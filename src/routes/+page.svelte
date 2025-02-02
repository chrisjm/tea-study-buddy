<script lang="ts">
	import TeaSessionList from '$lib/components/TeaSessionList.svelte';
	import NewTeaSessionForm from '$lib/components/NewTeaSessionForm.svelte';

	let showForm = false;

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
					aria-label="Start new tea session"
				>
					Start New Tea Session
				</button>
			</section>
		{:else}
			<div class="mx-auto max-w-2xl">
				<NewTeaSessionForm onClose={handleFormToggle} />
			</div>
		{/if}
	</div>
</div>
