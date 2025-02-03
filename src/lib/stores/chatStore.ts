import { writable } from 'svelte/store';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  threadId: string;
}

function createChatStore() {
  const { subscribe, set, update } = writable<ChatState>({
    messages: [],
    isLoading: false,
    threadId: 'default'
  });

  return {
    subscribe,
    setMessages: (messages: ChatMessage[]) =>
      update(state => ({ ...state, messages })),
    addMessage: (message: ChatMessage) =>
      update(state => ({ ...state, messages: [...state.messages, message] })),
    setLoading: (isLoading: boolean) =>
      update(state => ({ ...state, isLoading })),
    setThreadId: (threadId: string) =>
      update(state => ({ ...state, threadId })),
    reset: () => set({ messages: [], isLoading: false, threadId: 'default' })
  };
}

export const chatStore = createChatStore();
