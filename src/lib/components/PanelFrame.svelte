<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="panel">
	<span class="bracket bracket--tl" aria-hidden="true"></span>
	<span class="bracket bracket--br" aria-hidden="true"></span>
	{@render children()}
</div>

<style>
	.panel {
		position: relative;
		background: var(--panel);
		padding: 2.5rem;
	}

	.bracket {
		position: absolute;
		width: 1.75rem;
		height: 1.75rem;
		border: 2px solid var(--lime-500);
		pointer-events: none;
	}
	.bracket--tl {
		top: -5px;
		left: -5px;
		border-right: 0;
		border-bottom: 0;
	}
	.bracket--br {
		bottom: -5px;
		right: -5px;
		border-left: 0;
		border-top: 0;
	}

	@media (max-width: 40rem) {
		.panel {
			padding: 1.5rem 1.25rem;
		}
	}
</style>
