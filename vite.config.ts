import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// Ensure environment variables are available
	define: {
		'process.env.OPENAI_ASSISTANT_ID': JSON.stringify(process.env.OPENAI_ASSISTANT_ID),
		'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
	}
});
