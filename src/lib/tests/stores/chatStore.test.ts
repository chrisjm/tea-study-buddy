import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { chatStore } from '$lib/stores/chatStore';
import type { ChatMessage } from '$lib/stores/chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    chatStore.reset();
  });

  it('should initialize with empty state', () => {
    const state = get(chatStore);
    expect(state.messages).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.threadId).toBe('default');
  });

  it('should add a message', () => {
    const message: ChatMessage = { 
      role: 'user', 
      content: 'How should I brew green tea?' 
    };
    chatStore.addMessage(message);
    
    const state = get(chatStore);
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(message);
  });

  it('should handle multiple messages', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'How should I brew green tea?' },
      { role: 'assistant', content: 'I recommend brewing green tea at 75°C for 2-3 minutes.' }
    ];
    
    messages.forEach(msg => chatStore.addMessage(msg));
    
    const state = get(chatStore);
    expect(state.messages).toHaveLength(2);
    expect(state.messages).toEqual(messages);
  });

  it('should update loading state', () => {
    chatStore.setLoading(true);
    expect(get(chatStore).isLoading).toBe(true);
    
    chatStore.setLoading(false);
    expect(get(chatStore).isLoading).toBe(false);
  });

  it('should update thread ID', () => {
    const newThreadId = 'test-thread-123';
    chatStore.setThreadId(newThreadId);
    expect(get(chatStore).threadId).toBe(newThreadId);
  });

  it('should reset store to initial state', () => {
    // Setup some state
    chatStore.addMessage({ role: 'user', content: 'test' });
    chatStore.setLoading(true);
    chatStore.setThreadId('test-thread');

    // Reset
    chatStore.reset();

    // Verify reset state
    const state = get(chatStore);
    expect(state).toEqual({
      messages: [],
      isLoading: false,
      threadId: 'default'
    });
  });
});
