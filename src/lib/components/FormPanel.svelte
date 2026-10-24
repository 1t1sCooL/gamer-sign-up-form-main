<script lang="ts">
	import type { SignupForm } from '../signup/form.svelte';
	import type { FieldError } from '../signup/validation';
	import PanelFrame from './PanelFrame.svelte';

	let { form }: { form: SignupForm } = $props();

	let callsignInput: HTMLInputElement;
	let emailInput: HTMLInputElement;
	let passwordInput: HTMLInputElement;
	let confirmInput: HTMLInputElement;

	const inputs = () => ({
		callsign: callsignInput,
		email: emailInput,
		password: passwordInput,
		confirm: confirmInput
	});

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (form.locked) return;

		form.markAllChecked();
		const invalid = form.invalidFields;

		if (invalid.length > 0) {
			form.shakeKey++;
			const n = invalid.length;
			form.announcement = `${n} field${n === 1 ? '' : 's'} need${n === 1 ? 's' : ''} attention.`;
			const first = invalid[0];
			if (first === 'terms') termsInput?.focus();
			else inputs()[first]?.focus();
			return;
		}

		form.beginSubmit();
		setTimeout(() => form.succeed(), 1600);
	}

	let termsInput: HTMLInputElement;

	// Caps-Lock warning while typing a password (bonus).
	function trackCaps(event: KeyboardEvent) {
		form.capsLock = event.getModifierState?.('CapsLock') ?? false;
	}
</script>

<PanelFrame>
	<form class="form" novalidate onsubmit={onSubmit} aria-labelledby="form-title">
		<header class="form__head">
			<h2 id="form-title" class="form__title">New operator</h2>
			<span class="form__req form__req--full">All fields required</span>
			<span class="form__req form__req--short">All required</span>
		</header>

		<!-- Callsign -->
		<div class="field" class:field--error={form.visibleErrors.callsign}>
			<label class="field__label" for="callsign">
				<span class="field__caret">&gt;</span> Callsign
			</label>
			<div class="control">
				<input
					bind:this={callsignInput}
					bind:value={form.callsign}
					onblur={() => form.blur('callsign')}
					id="callsign"
					name="callsign"
					type="text"
					inputmode="text"
					autocomplete="username"
					spellcheck="false"
					placeholder="e.g. Vortex_07"
					disabled={form.locked}
					aria-invalid={!!form.visibleErrors.callsign}
					aria-describedby={form.visibleErrors.callsign ? 'callsign-error' : 'callsign-hint'}
				/>
				{#if form.showCheck.callsign}{@render check()}{/if}
			</div>
			{#if form.visibleErrors.callsign}
				{@render errorLine('callsign-error', form.visibleErrors.callsign)}
			{:else}
				<p class="msg msg--hint" id="callsign-hint">3–20 characters: letters, numbers, _ or -</p>
			{/if}
		</div>

		<!-- Email -->
		<div class="field" class:field--error={form.visibleErrors.email}>
			<label class="field__label" for="email">
				<span class="field__caret">&gt;</span> Email
			</label>
			<div class="control">
				<input
					bind:this={emailInput}
					bind:value={form.email}
					onblur={() => form.blur('email')}
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					spellcheck="false"
					placeholder="you@example.com"
					disabled={form.locked}
					aria-invalid={!!form.visibleErrors.email}
					aria-describedby={form.visibleErrors.email ? 'email-error' : undefined}
				/>
				{#if form.showCheck.email}{@render check()}{/if}
			</div>
			{#if form.visibleErrors.email}{@render errorLine('email-error', form.visibleErrors.email)}{/if}
		</div>

		<!-- Password -->
		<div class="field" class:field--error={form.visibleErrors.password}>
			<label class="field__label" for="password">
				<span class="field__caret">&gt;</span> Password
			</label>
			<div class="control">
				<input
					bind:this={passwordInput}
					bind:value={form.password}
					onblur={() => form.blur('password')}
					onkeyup={trackCaps}
					onkeydown={trackCaps}
					id="password"
					name="password"
					type={form.showPassword ? 'text' : 'password'}
					autocomplete="new-password"
					placeholder=""
					disabled={form.locked}
					class:masked={!form.showPassword}
					aria-invalid={!!form.visibleErrors.password}
					aria-describedby="password-strength {form.visibleErrors.password
						? 'password-error'
						: 'password-hint'}"
				/>
				{#if form.showCheck.password}{@render check()}{/if}
				{@render eye(form.showPassword, () => (form.showPassword = !form.showPassword), 'password')}
			</div>

			<div class="meter" data-level={form.strength.score} aria-hidden="true">
				<span class="seg" class:lit={form.strength.score >= 1}></span>
				<span class="seg" class:lit={form.strength.score >= 2}></span>
				<span class="seg" class:lit={form.strength.score >= 3}></span>
				<span class="seg" class:lit={form.strength.score >= 4}></span>
			</div>

			<div class="meter-row">
				{#if form.visibleErrors.password}
					{@render errorLine('password-error', form.visibleErrors.password)}
				{:else}
					<p class="msg msg--hint" id="password-hint">At least 8 characters</p>
				{/if}
				<span class="strength" data-level={form.strength.score}>{form.strength.label}</span>
			</div>

			{#if form.capsLock && !form.locked}
				<p class="msg msg--caps">Caps Lock is on.</p>
			{/if}
		</div>

		<!-- Confirm -->
		<div class="field" class:field--error={form.visibleErrors.confirm}>
			<label class="field__label" for="confirm">
				<span class="field__caret">&gt;</span> Confirm password
			</label>
			<div class="control">
				<input
					bind:this={confirmInput}
					bind:value={form.confirm}
					onblur={() => form.blur('confirm')}
					onkeyup={trackCaps}
					id="confirm"
					name="confirm"
					type={form.showConfirm ? 'text' : 'password'}
					autocomplete="new-password"
					disabled={form.locked}
					class:masked={!form.showConfirm}
					aria-invalid={!!form.visibleErrors.confirm}
					aria-describedby={form.visibleErrors.confirm ? 'confirm-error' : undefined}
				/>
				{#if form.showCheck.confirm}{@render check()}{/if}
				{@render eye(form.showConfirm, () => (form.showConfirm = !form.showConfirm), 'confirm password')}
			</div>
			{#if form.visibleErrors.confirm}
				{@render errorLine('confirm-error', form.visibleErrors.confirm)}
			{/if}
		</div>

		<!-- Terms -->
		<div class="field field--terms" class:field--error={form.termsError}>
			<label class="terms">
				<input
					bind:this={termsInput}
					bind:checked={form.terms}
					type="checkbox"
					class="terms__box"
					disabled={form.locked}
					aria-invalid={!!form.termsError}
					aria-describedby={form.termsError ? 'terms-error' : undefined}
				/>
				<span class="terms__label"
					>I accept the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span
				>
			</label>
			{#if form.termsError}{@render errorLine('terms-error', form.termsError)}{/if}
		</div>

		<button class="btn" type="submit" data-state={form.status} disabled={form.locked}>
			{#if form.status === 'submitting'}Transmitting_{:else}Initialize account{/if}
		</button>

		<p class="form__login">Already an operator? <a href="#login">Log in</a></p>
	</form>
</PanelFrame>

<!-- ───────── reusable bits ───────── -->
{#snippet check()}
	<svg class="icon-check" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
		<path
			stroke="currentColor"
			stroke-linecap="square"
			stroke-width="1.667"
			d="M16.666 5 7.5 14.167 3.333 10"
		/>
	</svg>
{/snippet}

{#snippet eye(visible: boolean, toggle: () => void, name: string)}
	<button
		type="button"
		class="eye"
		class:eye--on={visible}
		onclick={toggle}
		disabled={form.locked}
		aria-pressed={visible}
		aria-label={visible ? `Hide ${name}` : `Show ${name}`}
	>
		{#if visible}
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<path
					stroke="currentColor"
					stroke-linecap="square"
					stroke-width="1.25"
					d="M8.333 4.333A7.5 7.5 0 0 1 10 4.167c5.333 0 8.333 5.833 8.333 5.833a14.2 14.2 0 0 1-2 2.75M5.334 5.417C3 7 1.667 10 1.667 10s3 5.833 8.333 5.833a8 8 0 0 0 4.334-1.333M2.5 2.5l15 15"
				/>
			</svg>
		{:else}
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<path
					stroke="currentColor"
					stroke-linecap="square"
					stroke-width="1.25"
					d="M1.667 10s3-5.833 8.333-5.833S18.334 10 18.334 10s-3 5.833-8.334 5.833S1.667 10 1.667 10Z"
				/>
				<path
					stroke="currentColor"
					stroke-linecap="square"
					stroke-width="1.25"
					d="m10 7.5 2.5 2.5-2.5 2.5L7.5 10z"
				/>
			</svg>
		{/if}
	</button>
{/snippet}

{#snippet errorLine(id: string, err: FieldError)}
	<p class="msg msg--error" {id}>
		<svg class="icon-alert" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				stroke="currentColor"
				stroke-linecap="square"
				stroke-width="1.333"
				d="M8 2 1.333 14h13.333zm0 4.667V10m0 2h.007"
			/>
		</svg>
		<span>{err.message}</span>
	</p>
{/snippet}

<style>
	.form {
		display: flex;
		flex-direction: column;
	}

	.form__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form__title {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.875rem;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-100);
	}

	.form__req {
		font-family: var(--font-mono);
		font-weight: 400;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-600);
	}
	.form__req--short {
		display: none;
	}

	.field {
		display: flex;
		flex-direction: column;
	}
	.field + .field {
		margin-top: 1.25rem;
	}

	.field__label {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--neutral-400);
		margin-bottom: 0.5rem;
	}
	.field__caret {
		color: var(--lime-500);
	}

	.control {
		position: relative;
		display: flex;
		align-items: center;
	}

	input[type='text'],
	input[type='email'],
	input[type='password'] {
		width: 100%;
		height: 3.25rem;
		padding: 0 1rem;
		background: var(--field-bg);
		border: 1px solid var(--border);
		border-radius: 0;
		color: var(--neutral-100);
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.5;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}
	input::placeholder {
		color: var(--neutral-600);
		opacity: 1;
	}
	input.masked:not(:placeholder-shown) {
		letter-spacing: 0.16em;
	}
	input:hover:not(:disabled):not(:focus) {
		border-color: var(--border-hover);
	}
	input:disabled {
		opacity: 1;
		cursor: default;
	}

	/* leave room for trailing icons */
	.control:has(.eye) input {
		padding-right: 3rem;
	}
	.control:has(.eye):has(.icon-check) input {
		padding-right: 5rem;
	}
	.control:has(.icon-check):not(:has(.eye)) input {
		padding-right: 3rem;
	}

	.icon-check {
		position: absolute;
		right: 1rem;
		color: var(--lime-500);
		pointer-events: none;
	}
	.control:has(.eye) .icon-check {
		right: 3rem;
	}

	.eye {
		position: absolute;
		right: 0.75rem;
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		color: var(--neutral-400);
		transition: color 0.15s ease;
	}
	.eye:hover {
		color: var(--neutral-100);
	}
	.eye--on {
		color: var(--lime-500);
	}

	/* error state */
	.field--error input {
		border-color: var(--red-400);
	}

	.msg {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		margin-top: 0.5rem;
	}
	.msg--hint {
		color: var(--neutral-500);
	}
	.msg--error {
		color: var(--red-400);
	}
	.msg--caps {
		color: var(--amber-400);
	}
	.icon-alert {
		flex: none;
		margin-top: 1px;
	}

	/* strength meter */
	.meter {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
	.seg {
		height: 4px;
		background: var(--neutral-800);
	}
	.meter[data-level='1'] .seg.lit {
		background: var(--red-400);
	}
	.meter[data-level='2'] .seg.lit {
		background: var(--amber-400);
	}
	.meter[data-level='3'] .seg.lit,
	.meter[data-level='4'] .seg.lit {
		background: var(--lime-500);
	}

	.meter-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}
	.meter-row .msg {
		flex: 1;
	}
	.strength {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.3333;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		margin-top: 0.5rem;
		white-space: nowrap;
	}
	.strength[data-level='1'] {
		color: var(--red-400);
	}
	.strength[data-level='2'] {
		color: var(--amber-400);
	}
	.strength[data-level='3'],
	.strength[data-level='4'] {
		color: var(--lime-500);
	}

	/* terms */
	.field--terms {
		margin-top: 1.5rem;
	}
	.terms {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
	}
	.terms__box {
		flex: none;
		appearance: none;
		-webkit-appearance: none;
		width: 1.25rem;
		height: 1.25rem;
		margin-top: 0.125rem;
		background: var(--field-bg);
		border: 1px solid var(--border);
		display: grid;
		place-items: center;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}
	.terms__box:hover:not(:disabled) {
		border-color: var(--border-hover);
	}
	.terms__box:checked {
		background: var(--lime-500);
		border-color: var(--lime-500);
	}
	.terms__box:checked::after {
		content: '';
		width: 11px;
		height: 7px;
		border-left: 2px solid var(--neutral-950);
		border-bottom: 2px solid var(--neutral-950);
		transform: translateY(-1px) rotate(-45deg);
	}
	.field--error .terms__box {
		border-color: var(--red-400);
	}
	.terms__label {
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--neutral-100);
	}
	.terms__label a {
		color: var(--lime-500);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.terms__label a:hover {
		color: var(--neutral-50);
	}

	/* submit button */
	.btn {
		margin-top: 1.5rem;
		height: 3rem;
		width: 100%;
		background: var(--lime-500);
		color: var(--neutral-950);
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1rem;
		line-height: 1.5;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		border: 1px solid var(--lime-500);
		transition:
			background 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease;
	}
	.btn:hover:not(:disabled) {
		background: var(--neutral-50);
		border-color: var(--neutral-50);
		box-shadow: inset 0 -3px 0 0 var(--lime-500);
	}
	.btn[data-state='submitting'] {
		background: transparent;
		color: var(--lime-500);
		cursor: progress;
	}

	.form__login {
		margin-top: 1.5rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7143;
		color: var(--neutral-300);
	}
	.form__login a {
		color: var(--lime-500);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.form__login a:hover {
		color: var(--neutral-50);
	}

	/* Stacked layout gets a divider under the panel header (as in the mobile design) */
	@media (max-width: 64rem) {
		.form__head {
			border-bottom: 1px solid var(--border);
			padding-bottom: 1rem;
			margin-bottom: 1.25rem;
		}
	}

	@media (max-width: 40rem) {
		.form__req--full {
			display: none;
		}
		.form__req--short {
			display: inline;
		}
	}
</style>
