<script lang="ts">
  import Chat from '$lib/components/Chat.svelte';

  let teaSession: {
    teaType: string;
    teaStyle: string;
    brewingTemp?: number;
    steepTime?: number;
    notes?: string;
  } | null = null;

  let showForm = true;
  let formData = {
    teaType: 'Oolong',
    teaStyle: 'Alishan',
    brewingTemp: undefined as number | undefined,
    steepTime: undefined as number | undefined,
    notes: ''
  };

  const handleStartSession = () => {
    if (!formData.teaType || !formData.teaStyle) return;
    teaSession = { ...formData };
    showForm = false;
  };

  const handleNewSession = () => {
    showForm = true;
    teaSession = null;
    formData = {
      teaType: '',
      teaStyle: '',
      brewingTemp: undefined,
      steepTime: undefined,
      notes: ''
    };
  };
</script>

<div class="mx-auto flex h-screen max-w-4xl flex-col gap-4 p-4">
  <header class="text-center">
    <h1 class="mb-2 text-3xl font-bold">Tea Study Buddy</h1>
    <p class="text-gray-600">Your AI companion for tea-enhanced studying</p>
  </header>

  {#if showForm}
    <div class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-xl font-semibold">Start a New Tea Session</h2>
      <form on:submit|preventDefault={handleStartSession} class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="teaType" class="mb-1 block text-sm font-medium text-gray-700">Tea Type *</label>
            <input
              type="text"
              id="teaType"
              bind:value={formData.teaType}
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label for="teaStyle" class="mb-1 block text-sm font-medium text-gray-700">Tea Style *</label>
            <input
              type="text"
              id="teaStyle"
              bind:value={formData.teaStyle}
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label for="brewingTemp" class="mb-1 block text-sm font-medium text-gray-700">
              Brewing Temperature (°C)
            </label>
            <input
              type="number"
              id="brewingTemp"
              bind:value={formData.brewingTemp}
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label for="steepTime" class="mb-1 block text-sm font-medium text-gray-700">
              Steep Time (seconds)
            </label>
            <input
              type="number"
              id="steepTime"
              bind:value={formData.steepTime}
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label for="notes" class="mb-1 block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            bind:value={formData.notes}
            rows="3"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Start Session
        </button>
      </form>
    </div>
  {:else}
    <div class="flex flex-1 flex-col rounded-lg bg-white shadow-lg">
      <div class="border-b border-gray-200 p-4">
        <button
          on:click={handleNewSession}
          class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Start New Session
        </button>
      </div>
      <div class="flex-1">
        <Chat {teaSession} />
      </div>
    </div>
  {/if}
</div>
