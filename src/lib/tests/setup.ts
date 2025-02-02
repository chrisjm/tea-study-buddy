import { beforeEach, vi } from 'vitest';

// Mock OpenAI
export const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: "Mocked response",
            role: "assistant"
          }
        }]
      })
    }
  }
};

vi.mock('openai', () => ({
  OpenAI: vi.fn(() => mockOpenAI)
}));

// Mock SvelteKit's environment variables
vi.mock('$env/dynamic/private', () => ({
  env: { OPENAI_API_KEY: 'test-key' }
}));

// Mock browser APIs
vi.mock('$app/environment', () => ({
  browser: true
}));

// Mock navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn()
}));

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
