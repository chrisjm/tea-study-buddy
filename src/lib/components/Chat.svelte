<script lang="ts">
	import { onMount } from 'svelte';
	import { chatStore } from '$lib/stores/chatStore';
	import TeaSessionInfo from './TeaSessionInfo.svelte';
	import MessageList from './MessageList.svelte';
	import MessageInput from './MessageInput.svelte';
	import type { TeaSession } from '$lib/types';

	export let teaSession: TeaSession | null = null;

	$: ({ messages, isLoading } = $chatStore);

	let error: string | null = null;

	const handleSubmit = async (message: string) => {
		try {
			chatStore.addMessage({ role: 'user', content: message });
			chatStore.setLoading(true);
			error = null;

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message,
					threadId: teaSession?.threadId || 'default',
					teaSessionId: teaSession?.id
				})
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			const data = await response.json();
			chatStore.addMessage({
				role: 'assistant',
				content: data.message,
				inputTokens: data.inputTokens,
				outputTokens: data.outputTokens,
				completionId: data.completionId
			});
			chatStore.setThreadId(data.threadId);
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: 'An error occurred while sending the message';
		} finally {
			chatStore.setLoading(false);
		}
	};

	const loadThread = async () => {
		if (!teaSession) return;

		try {
			chatStore.setLoading(true);
			const response = await fetch(`/api/threads/${teaSession.id}`);
			if (!response.ok) {
				throw new Error('Failed to load chat history');
			}
			const data = await response.json();
			if (data.threadId) {
				chatStore.setThreadId(data.threadId);
			}
			chatStore.setMessages(data.messages);
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: 'An error occurred while loading chat history';
		} finally {
			chatStore.setLoading(false);
		}
	};

	onMount(() => {
		loadThread();
		return () => {
			chatStore.reset();
		};
	});
</script>

<div
	class="flex h-full flex-col bg-white transition-colors duration-200 dark:bg-gray-800"
>
	<TeaSessionInfo {teaSession} />
	<MessageList {messages} {isLoading} />
	{#if error}
		<div class="text-red-500">{error}</div>
	{/if}
	<div class="border-t border-gray-200 p-4 dark:border-gray-700">
		<MessageInput {isLoading} onSubmit={handleSubmit} />
	</div>
</div>
