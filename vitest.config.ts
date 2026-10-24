import { defineConfig } from 'vitest/config';

// Standalone config so unit tests run the pure logic without the SvelteKit plugin.
// (The project tsconfig's `extends: "$app/tsconfig"` resolves after `svelte-kit sync`,
// which the `prepare` script runs on install.)
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node'
	}
});
