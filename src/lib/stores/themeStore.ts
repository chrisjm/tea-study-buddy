import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const createThemeStore = () => {
    const { subscribe, set } = writable<Theme>('light');

    return {
        subscribe,
        init: () => {
            if (!browser) return;

            // Check if system is in dark mode
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
                const theme = e.matches ? 'dark' : 'light';
                set(theme);
                document.documentElement.classList.toggle('dark', e.matches);
            };

            // Initial check
            handleChange(mediaQuery);

            // Listen for system theme changes
            mediaQuery.addEventListener('change', handleChange);
        }
    };
};

export const theme = createThemeStore();
