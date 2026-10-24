import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Fully prerendered static site (no server) → one index.html.
			adapter: adapter({
				pages: 'dist',
				assets: 'dist',
				fallback: undefined,
				precompress: false,
				strict: true
			}),

			// Terms / Privacy Policy / Log in are placeholder anchors with no page in
			// this challenge — don't fail the prerender over their missing targets.
			prerender: { handleMissingId: 'ignore' },

			// Deploy branch: serve the app from mmalabugin.ru/GamerSignUpForm/.
			// Absolute base paths are robust under a sub-path; on main this stays
			// COMMENTED so the default relative paths serve Vercel from the root.
			paths: { base: '/GamerSignUpForm', relative: false }
		})
	]
});
