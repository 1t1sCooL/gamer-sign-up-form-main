import {
	validateCallsign,
	validateEmail,
	validatePassword,
	validateConfirm,
	validateTerms,
	scorePassword,
	FAULT_LABEL,
	type Field,
	type FieldError
} from './validation';

export type Status = 'editing' | 'submitting' | 'success';
export type Tone = 'muted' | 'ok' | 'error';
export interface RowStatus {
	label: string;
	tone: Tone;
}

/** Ordered as they appear in the form — used for "first invalid" focus. */
export const TEXT_FIELDS = ['callsign', 'email', 'password', 'confirm'] as const;
export const ALL_FIELDS: Field[] = ['callsign', 'email', 'password', 'confirm', 'terms'];

/**
 * Reactive owner of the entire sign-up flow. A single instance is shared between
 * the form panel and the Operator-ID readout so the readout always mirrors the form.
 */
export class SignupForm {
	// --- raw field values ---------------------------------------------------
	callsign = $state('');
	email = $state('');
	password = $state('');
	confirm = $state('');
	terms = $state(false);

	// A field becomes "checked" when it loses focus with content, or on submit.
	// Once checked it re-validates live on every keystroke.
	checked = $state({ callsign: false, email: false, password: false, confirm: false });
	// The terms error only appears after a submit attempt.
	termsChecked = $state(false);

	showPassword = $state(false);
	showConfirm = $state(false);
	capsLock = $state(false);

	status = $state<Status>('editing');

	/** Live-region message, e.g. "3 fields need attention". */
	announcement = $state('');
	/** Bumped on an invalid submit to retrigger the shake animation. */
	shakeKey = $state(0);

	// --- raw errors (independent of whether the field was checked) ----------
	readonly errors = $derived<Record<(typeof TEXT_FIELDS)[number], FieldError | null>>({
		callsign: validateCallsign(this.callsign),
		email: validateEmail(this.email),
		password: validatePassword(this.password),
		confirm: validateConfirm(this.confirm, this.password)
	});

	// --- errors actually shown to the user ---------------------------------
	readonly visibleErrors = $derived<Record<(typeof TEXT_FIELDS)[number], FieldError | null>>({
		callsign: this.checked.callsign ? this.errors.callsign : null,
		email: this.checked.email ? this.errors.email : null,
		password: this.checked.password ? this.errors.password : null,
		confirm: this.checked.confirm ? this.errors.confirm : null
	});

	readonly termsError = $derived(this.termsChecked ? validateTerms(this.terms) : null);

	readonly strength = $derived(scorePassword(this.password));

	readonly valid = $derived({
		callsign: this.errors.callsign === null,
		email: this.errors.email === null,
		password: this.errors.password === null,
		confirm: this.errors.confirm === null,
		terms: this.terms
	});

	/** Green tick shows once a field has been checked and is valid. */
	readonly showCheck = $derived({
		callsign: this.checked.callsign && this.valid.callsign,
		email: this.checked.email && this.valid.email,
		password: this.checked.password && this.valid.password,
		confirm: this.checked.confirm && this.valid.confirm
	});

	readonly readyCount = $derived(ALL_FIELDS.filter((f) => this.valid[f]).length);

	readonly callsignDisplay = $derived(this.valid.callsign ? this.callsign.trim() : 'UNASSIGNED');

	readonly readyLabel = $derived(
		this.status === 'success' ? 'Provisioned' : `${this.readyCount}/5 ready`
	);

	readonly locked = $derived(this.status !== 'editing');

	// --- per-row status for the Operator-ID readout ------------------------
	rowStatus(field: Field): RowStatus {
		if (this.status === 'success') return { label: 'Locked', tone: 'muted' };

		if (field === 'terms') {
			if (this.valid.terms) return { label: 'OK', tone: 'ok' };
			return { label: 'Required', tone: this.termsError ? 'error' : 'muted' };
		}

		const err = this.visibleErrors[field];
		if (err) return { label: FAULT_LABEL[err.code], tone: 'error' };
		if (this.valid[field]) return { label: 'OK', tone: 'ok' };
		return { label: 'Pending', tone: 'muted' };
	}

	// --- actions -----------------------------------------------------------
	/** Called on blur — only marks the field checked if it has content. */
	blur(field: (typeof TEXT_FIELDS)[number]) {
		const hasContent = field === 'callsign' ? this[field].trim() !== '' : this[field] !== '';
		if (hasContent) this.checked[field] = true;
	}

	/** Invalid fields in form order (used to focus the first one). */
	get invalidFields(): Field[] {
		return ALL_FIELDS.filter((f) => !this.valid[f]);
	}

	/** Mark everything checked (used on submit so empty-field messages appear). */
	markAllChecked() {
		this.checked = { callsign: true, email: true, password: true, confirm: true };
		this.termsChecked = true;
	}

	beginSubmit() {
		this.status = 'submitting';
		this.showPassword = false;
		this.showConfirm = false;
		this.announcement = 'Transmitting your details.';
	}

	succeed() {
		this.status = 'success';
		this.announcement = `Operator ${this.callsign.trim()} provisioned. Your account is ready.`;
	}
}
