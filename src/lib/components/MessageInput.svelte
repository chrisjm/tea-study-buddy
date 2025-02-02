<script lang="ts">
  import { onMount } from 'svelte';

  export let isLoading = false;
  export let onSubmit: (message: string) => void;

  let inputMessage = '';
  let isRecording = false;
  let recognition: SpeechRecognition | null = null;
  let isSupported = false;
  let hasError = false;
  let errorMessage = '';

  onMount(() => {
    // Check for browser support
    isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

    if (isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;

        if (lastResult.isFinal) {
          inputMessage += ' ' + transcript;
          inputMessage = inputMessage.trim();
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        hasError = true;
        errorMessage = event.error;
        isRecording = false;
      };

      recognition.onend = () => {
        // Only stop recording if explicitly requested
        if (isRecording) {
          recognition?.start();
        }
      };
    }
  });

  const handleSubmit = () => {
    if (!inputMessage.trim() || isLoading) return;
    onSubmit(inputMessage.trim());
    inputMessage = '';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicrophoneClick = async () => {
    if (!isSupported) {
      hasError = true;
      errorMessage = 'Speech recognition is not supported in your browser';
      return;
    }

    try {
      if (isRecording) {
        recognition?.stop();
        isRecording = false;
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        hasError = false;
        errorMessage = '';
        recognition?.start();
        isRecording = true;
      }
    } catch (error) {
      hasError = true;
      errorMessage = 'Microphone permission denied';
      isRecording = false;
    }
  };

  const handleMicrophoneKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMicrophoneClick();
    }
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="flex flex-col gap-1"
>
  <div class="flex gap-2">
    <textarea
      bind:value={inputMessage}
      on:keydown={handleKeyDown}
      placeholder="Type your message..."
      class="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
      rows="1"
      disabled={isLoading}
      aria-label="Message input"
    ></textarea>
    <button
      type="button"
      on:click={handleMicrophoneClick}
      on:keydown={handleMicrophoneKeyDown}
      class="rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      disabled={isLoading}
      tabindex="0"
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        class:text-red-500={isRecording}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button
      type="submit"
      class="rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-2 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
      disabled={isLoading || !inputMessage.trim()}
    >
      Send
    </button>
  </div>
  {#if hasError}
    <p class="text-sm text-red-500 dark:text-red-400" role="alert">
      {errorMessage}
    </p>
  {/if}
</form>
