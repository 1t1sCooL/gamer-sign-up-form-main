<script lang="ts">
	import PanelFrame from './PanelFrame.svelte';
	import Slashes from './Slashes.svelte';

	let {
		callsign,
		heading = $bindable(),
		oncontinue
	}: {
		callsign: string;
		heading?: HTMLElement;
		oncontinue?: () => void;
	} = $props();
</script>

<PanelFrame>
	<div class="success">
		<svg
			class="hex"
			width="78"
			height="72"
			viewBox="0 0 78 72"
			fill="none"
			aria-hidden="true"
		>
			<g stroke="#bff538" stroke-linecap="square" stroke-width="1.5" filter="url(#hexglow)">
				<path d="m60.866 35.8-11 19.05h-22l-11-19.05 11-19.05h22z" />
				<path class="hex__tick" d="m30.866 35.8 6 6 11-12" />
			</g>
			<defs>
				<filter
					id="hexglow"
					width="80"
					height="80"
					x="-1.134"
					y="-4.2"
					color-interpolation-filters="sRGB"
					filterUnits="userSpaceOnUse"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="8" />
					<feColorMatrix
						values="0 0 0 0 0.74902 0 0 0 0 0.960784 0 0 0 0 0.219608 0 0 0 0.6 0"
					/>
					<feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
					<feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
				</filter>
			</defs>
		</svg>

		<h2 class="success__title" tabindex="-1" bind:this={heading}>
			<Slashes />Handshake complete
		</h2>

		<p class="success__body">
			Operator <span class="success__callsign">{callsign}</span> provisioned. Your account is ready.
		</p>

		<button class="btn-continue" type="button" onclick={oncontinue}>Continue to log in</button>
	</div>
</PanelFrame>

<style>
	.success {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		/* match the form panel's height (724px) so the centered layout doesn't shift */
		min-height: 40.25rem;
	}

	.hex {
		margin-top: -1rem;
		margin-bottom: 1.5rem;
	}
	.hex__tick {
		stroke-dasharray: 30;
		stroke-dashoffset: 0;
	}

	.success__title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.5rem;
		line-height: 1.3333;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--neutral-100);
		outline: none;
	}
	.success__body {
		margin-top: 1rem;
		max-width: 26rem;
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--neutral-300);
	}
	.success__callsign {
		color: var(--lime-500);
	}

	.btn-continue {
		margin-top: 2rem;
		width: 100%;
		height: 3rem;
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
	.btn-continue:hover {
		background: var(--neutral-50);
		border-color: var(--neutral-50);
		box-shadow: inset 0 -3px 0 0 var(--lime-500);
	}

	@media (prefers-reduced-motion: no-preference) {
		.hex__tick {
			stroke-dashoffset: 30;
			animation: draw 0.6s ease-out 0.15s forwards;
		}
		.hex {
			animation: pop 0.4s ease-out both;
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 40rem) {
		.success {
			min-height: 22rem;
		}
	}
</style>
