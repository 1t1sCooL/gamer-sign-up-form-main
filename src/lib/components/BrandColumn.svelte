<script lang="ts">
	import type { SignupForm } from '../signup/form.svelte';
	import Slashes from './Slashes.svelte';

	let { form }: { form: SignupForm } = $props();

	const ROWS: { field: Parameters<SignupForm['rowStatus']>[0]; label: string }[] = [
		{ field: 'callsign', label: 'Callsign' },
		{ field: 'email', label: 'Email' },
		{ field: 'password', label: 'Password' },
		{ field: 'confirm', label: 'Confirm' },
		{ field: 'terms', label: 'Terms' }
	];
</script>

<div class="brand">
	<header class="brand__head">
		<a class="brand__logo" href="#top" aria-label="NEONCORE home">
			<svg width="169" height="32" viewBox="0 0 169 32" fill="none" aria-hidden="true">
				<path stroke="#bff538" stroke-width="1.5" d="m30 16-7 12.12H9L2 16 9 3.88h14z" />
				<path fill="#bff538" d="m21 16-2.5 4.33h-5L11 16l2.5-4.33h5z" />
				<path
					fill="#e1ebf5"
					d="M44.896 22V10.48h2.448l6.736 8.032V10.48h2.336V22h-2.448L47.2 13.936V22zM60.8 22V10.48h10.624v2.32h-8.288v2.272h6.672v2.336h-6.672v2.272h8.288V22zm16.738 0q-.64 0-1.168-.304a2.6 2.6 0 0 1-.832-.832 2.3 2.3 0 0 1-.304-1.168v-6.912q0-.64.304-1.152.32-.528.832-.832a2.2 2.2 0 0 1 1.168-.32h6.912a2.1 2.1 0 0 1 1.136.32q.528.304.848.832.32.511.32 1.152v6.912q0 .64-.32 1.168a2.5 2.5 0 0 1-.848.832Q85.074 22 84.45 22zm.096-2.32h6.688q.048 0 .064-.016a.1.1 0 0 0 .032-.08v-6.688q0-.048-.032-.064-.016-.032-.064-.032h-6.688a.1.1 0 0 0-.08.032q-.016.015-.016.064v6.688q0 .048.016.08.032.015.08.016M91.076 22V10.48h2.448l6.736 8.032V10.48h2.336V22h-2.448l-6.768-8.064V22zm18.176 0a2.3 2.3 0 0 1-1.168-.304 2.6 2.6 0 0 1-.832-.832 2.3 2.3 0 0 1-.304-1.168v-6.912q0-.64.304-1.152.32-.528.832-.832.528-.32 1.168-.32h9.184v2.32h-8.64a.54.54 0 0 0-.4.144q-.144.128-.144.4v5.792q0 .256.144.4.145.144.4.144h8.64V22zm15.685 0q-.64 0-1.168-.304a2.6 2.6 0 0 1-.832-.832 2.3 2.3 0 0 1-.304-1.168v-6.912q0-.64.304-1.152.32-.528.832-.832a2.2 2.2 0 0 1 1.168-.32h6.912q.623 0 1.136.32.527.304.848.832.32.511.32 1.152v6.912q0 .64-.32 1.168a2.54 2.54 0 0 1-.848.832q-.513.304-1.136.304zm.096-2.32h6.688q.048 0 .064-.016a.1.1 0 0 0 .032-.08v-6.688q0-.048-.032-.064-.016-.032-.064-.032h-6.688a.1.1 0 0 0-.08.032q-.016.015-.016.064v6.688q0 .048.016.08.032.015.08.016M147.531 22l-3.408-4.064h3.024l2.816 3.344V22zm-9.056 0V10.496h9.2q.639 0 1.152.32.527.304.848.832t.32 1.152v3.04q0 .624-.32 1.152a2.54 2.54 0 0 1-.848.832 2.2 2.2 0 0 1-1.152.304l-6.896.016V22zm2.4-6.192h6.688q.048 0 .064-.016.032-.032.032-.064v-2.832q0-.048-.032-.064-.016-.032-.064-.032h-6.688a.1.1 0 0 0-.08.032q-.016.015-.016.064v2.832q0 .032.016.064.032.015.08.016M154.27 22V10.48h10.624v2.32h-8.288v2.272h6.672v2.336h-6.672v2.272h8.288V22z"
				/>
			</svg>
		</a>
		<span class="brand__ready brand__ready--top" data-lime={form.readyCount === 5 || form.status === 'success'}
			>{form.readyLabel}</span
		>
	</header>

	<h1 class="brand__headline">
		<Slashes /><span>Join the nexus</span>
	</h1>
	<p class="brand__subtitle">Initialize your NEONCORE identity</p>

	<hr class="brand__rule" />

	<section class="readout" aria-label="Operator ID status">
		<div class="readout__head">
			<span class="readout__key">Operator ID</span>
			<span class="brand__ready readout__ready" data-lime={form.readyCount === 5 || form.status === 'success'}
				>{form.readyLabel}</span
			>
			<span class="readout__value readout__value--inline">{form.callsignDisplay}</span>
		</div>

		<p
			class="readout__value readout__value--block"
			data-unassigned={!form.valid.callsign && form.status !== 'success'}
		>
			{form.callsignDisplay}
		</p>

		<dl class="readout__rows">
			{#each ROWS as row (row.field)}
				{@const st = form.rowStatus(row.field)}
				<div class="readout__row">
					<dt class="readout__row-key">{row.label}</dt>
					<span class="readout__leader" aria-hidden="true"></span>
					<dd class="readout__row-val" data-tone={st.tone}>{st.label}</dd>
				</div>
			{/each}
		</dl>
	</section>
</div>

<style>
	.brand {
		display: flex;
		flex-direction: column;
		/* logo sits a constant 74px below the panel top in every state */
		padding-top: 74px;
	}

	.brand__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.brand__logo {
		display: inline-flex;
		outline-offset: 6px;
	}

	.brand__ready {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-500);
	}
	.brand__ready[data-lime='true'],
	.readout__ready[data-lime='true'] {
		color: var(--lime-500);
	}
	.brand__ready--top {
		display: none;
	}

	.brand__headline {
		margin-top: 5rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 4.5rem;
		line-height: 1.1111;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--neutral-100);
		max-width: 11ch;
	}

	.brand__subtitle {
		margin-top: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-500);
	}

	.brand__rule {
		margin-top: 4rem;
		border: 0;
		border-top: 1px solid var(--neutral-800);
	}

	.readout {
		margin-top: 1.25rem;
	}
	.readout__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}
	.readout__key {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-500);
	}
	.readout__ready {
		display: inline;
	}
	.readout__value--inline {
		display: none;
	}

	.readout__value--block {
		margin-top: 0.125rem;
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		line-height: 1.3333;
		letter-spacing: 0.04em;
		color: var(--neutral-100);
		word-break: break-word;
	}
	.readout__value--block[data-unassigned='true'] {
		color: var(--neutral-700);
	}

	.readout__rows {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.readout__row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.readout__row-key {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-500);
		white-space: nowrap;
	}
	.readout__leader {
		flex: 1;
		border-bottom: 1px dotted var(--neutral-700);
		transform: translateY(-1px);
	}
	.readout__row-val {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.readout__row-val[data-tone='muted'] {
		color: var(--neutral-600);
	}
	.readout__row-val[data-tone='ok'] {
		color: var(--neutral-100);
	}
	.readout__row-val[data-tone='error'] {
		color: var(--red-400);
	}

	/* ---- tablet / mobile: single column, one-line operator strip ---- */
	@media (max-width: 64rem) {
		.brand {
			padding-top: 0;
		}
		.brand__ready--top {
			display: inline;
		}
		.readout__ready,
		.readout__value--block,
		.readout__rows {
			display: none;
		}
		.readout__value--inline {
			display: inline;
			font-family: var(--font-mono);
			font-size: 0.75rem;
			line-height: 1.3333;
			letter-spacing: 0.16em;
			text-transform: uppercase;
			color: var(--neutral-100);
		}

		.brand__headline {
			margin-top: 2.25rem;
			font-size: 2.5rem;
			line-height: 1.2;
		}
		.brand__subtitle {
			margin-top: 0.25rem;
		}
		.brand__rule {
			margin-top: 1rem;
		}
		.readout {
			margin-top: 1rem;
		}
	}

	@media (max-width: 40rem) {
		.brand__headline {
			font-size: 2.25rem;
			line-height: 1.1111;
			max-width: 9ch;
		}
	}
</style>
