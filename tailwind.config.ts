import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': 'rgb(31, 41, 55)',
						'--tw-prose-headings': 'rgb(31, 41, 55)',
						'--tw-prose-links': 'rgb(37, 99, 235)',
						'--tw-prose-code': 'rgb(31, 41, 55)',
						'--tw-prose-pre-code': 'rgb(229, 231, 235)',
						'--tw-prose-pre-bg': 'rgb(55, 65, 81)',
						code: {
							backgroundColor: 'rgb(243, 244, 246)',
							padding: '0.2em 0.4em',
							borderRadius: '0.25rem',
							fontWeight: '400'
						},
						'pre code': {
							backgroundColor: 'transparent',
							padding: '0',
							borderRadius: '0',
							fontWeight: '400'
						},
						pre: {
							color: 'rgb(229, 231, 235)',
							backgroundColor: 'rgb(55, 65, 81)',
							padding: '1rem',
							borderRadius: '0.375rem',
							margin: '0.5rem 0'
						}
					}
				}
			}
		}
	},

	plugins: [typography, forms]
} satisfies Config;
