<script lang="ts">
	import { SignupForm } from '../lib/signup/form.svelte';
	import BrandColumn from '#lib/components/BrandColumn.svelte';
	import FormPanel from '#lib/components/FormPanel.svelte';
	import SuccessPanel from '#lib/components/SuccessPanel.svelte';

	let form = $state(new SignupForm());
	let successHeading = $state<HTMLElement>();
	let shaking = $state(false);

	// Move focus to the success heading when the handshake completes.
	$effect(() => {
		if (form.status === 'success' && successHeading) successHeading.focus();
	});

	// Replay the panel shake whenever a submit is rejected.
	$effect(() => {
		if (form.shakeKey === 0) return;
		form.shakeKey; // track
		shaking = false;
		requestAnimationFrame(() => requestAnimationFrame(() => (shaking = true)));
	});

	function restart() {
		form = new SignupForm();
	}
</script>

<div class="page" id="top">
	<svg
		class="backdrop"
		width="960"
		height="960"
		viewBox="0 0 960 960"
		fill="none"
		aria-hidden="true"
	>
		<path stroke="#17212b" d="M950.4 480 715.2 887.376H244.8L9.6 480 244.8 72.624h470.4z" />
		<path stroke="#17212b" d="M806.4 480 643.2 762.672H316.8L153.6 480l163.2-282.672h326.4z" />
		<path
			stroke="#bff538"
			opacity=".56"
			d="m662.4 480-91.2 157.968H388.8L297.6 480l91.2-157.968h182.4z"
		/>
	</svg>

	<main class="layout">
		<BrandColumn {form} />

		<div class="panel-col" class:shaking onanimationend={() => (shaking = false)}>
			{#if form.status === 'success'}
				<SuccessPanel callsign={form.callsign.trim()} bind:heading={successHeading} oncontinue={restart} />
			{:else}
				<FormPanel {form} />
			{/if}
		</div>
	</main>

	<footer class="site-footer">
		<p>
			Challenge by <a href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>. Coded by
			<a href="https://www.frontendmentor.io/profile/1t1sCooL">1t1sCooL</a>.
		</p>
		<p class="site-footer__meta">NEONCORE // competitive-gaming network — a build demo, not a real service.</p>
	</footer>

	<div class="sr-only" aria-live="assertive" aria-atomic="true">{form.announcement}</div>
</div>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		overflow-x: clip;
	}

	.backdrop {
		position: absolute;
		top: 0;
		right: -28.5rem;
		width: 55rem;
		height: auto;
		z-index: 0;
		pointer-events: none;
	}

	.layout {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		max-width: 90rem;
		margin-inline: auto;
		padding: 4rem 10rem;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 30rem;
		gap: 5rem;
		align-items: start;
		align-content: center;
	}

	.panel-col {
		min-width: 0;
	}

	/* invalid-submit shake (motion-safe) */
	@media (prefers-reduced-motion: no-preference) {
		.panel-col.shaking {
			animation: shake 0.4s ease;
		}
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-8px);
		}
		40% {
			transform: translateX(8px);
		}
		60% {
			transform: translateX(-5px);
		}
		80% {
			transform: translateX(5px);
		}
	}

	.site-footer {
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--neutral-800);
		padding: 2rem 2.5rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		letter-spacing: 0.04em;
		color: var(--neutral-500);
	}
	.site-footer a {
		color: var(--lime-500);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.site-footer a:hover {
		color: var(--neutral-50);
	}
	.site-footer__meta {
		margin-top: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--neutral-700);
	}

	@media (max-width: 64rem) {
		.layout {
			min-height: 0;
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 2.75rem 2.5rem;
			align-items: stretch;
			align-content: start;
		}
		.backdrop {
			display: none;
		}
	}

	@media (max-width: 40rem) {
		.layout {
			padding: 2.25rem 1rem;
			gap: 1.75rem;
		}
		.site-footer {
			padding: 1.75rem 1.25rem;
		}
	}
</style>
