<script lang="ts">
  import TeaSessionList from '$lib/components/TeaSessionList.svelte';
  import { goto } from '$app/navigation';

  let showForm = false;
  let formData = {
    teaType: '',
    teaStyle: '',
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
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-center mb-8">Tea Study Buddy</h1>
  
  <div class="space-y-8">
    {#if !showForm}
      <section>
        <h2 class="text-xl font-semibold mb-4">Your Tea Sessions</h2>
        <TeaSessionList />
      </section>

      <section class="text-center">
        <button 
          on:click={() => showForm = true}
          class="inline-block bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
          tabindex="0"
          role="button"
        >
          Start New Tea Session
        </button>
      </section>
    {:else}
      <div class="max-w-2xl mx-auto">
        <div class="rounded-lg bg-white p-6 shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Start a New Tea Session</h2>
            <button
              on:click={() => showForm = false}
              class="text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form on:submit={handleStartSession} class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="teaType" class="mb-1 block text-sm font-medium text-gray-700">Tea Type *</label>
                <input
                  type="text"
                  id="teaType"
                  bind:value={formData.teaType}
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label for="teaStyle" class="mb-1 block text-sm font-medium text-gray-700">Tea Style *</label>
                <input
                  type="text"
                  id="teaStyle"
                  bind:value={formData.teaStyle}
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
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
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
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
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label for="notes" class="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                bind:value={formData.notes}
                rows="3"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                on:click={() => showForm = false}
                class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
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
