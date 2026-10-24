// Pure, framework-free validation + password-strength logic for the NEONCORE sign-up form.
// Kept separate from the reactive state so it can be unit-tested in isolation.

export type Field = 'callsign' | 'email' | 'password' | 'confirm' | 'terms';

/** Machine code → drives the Operator-ID fault label; `message` is shown under the field. */
export type FaultCode =
	| 'missing'
	| 'short'
	| 'long'
	| 'chars'
	| 'malformed'
	| 'mismatch'
	| 'required';

export interface FieldError {
	code: FaultCode;
	message: string;
}

const CALLSIGN_RE = /^[A-Za-z0-9_-]+$/;
// Pragmatic email check — a single @, non-empty local part, and a dotted domain.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCallsign(raw: string): FieldError | null {
	const v = raw.trim();
	if (v === '') return { code: 'missing', message: 'Enter a callsign' };
	if (v.length < 3) return { code: 'short', message: 'Use at least 3 characters' };
	if (v.length > 20) return { code: 'long', message: 'Use 20 characters or fewer' };
	if (!CALLSIGN_RE.test(v)) return { code: 'chars', message: 'Use letters, numbers, _ or - only' };
	return null;
}

export function validateEmail(raw: string): FieldError | null {
	const v = raw.trim();
	if (v === '') return { code: 'missing', message: 'Enter your email' };
	if (!EMAIL_RE.test(v)) {
		return { code: 'malformed', message: 'Enter a valid email, like you@example.com' };
	}
	return null;
}

export function validatePassword(raw: string): FieldError | null {
	if (raw === '') return { code: 'missing', message: 'Enter a password' };
	if (raw.length < 8) return { code: 'short', message: 'Use at least 8 characters' };
	return null;
}

export function validateConfirm(raw: string, password: string): FieldError | null {
	if (raw === '') return { code: 'missing', message: 'Confirm your password' };
	if (raw !== password) return { code: 'mismatch', message: "Passwords don't match" };
	return null;
}

export function validateTerms(accepted: boolean): FieldError | null {
	return accepted ? null : { code: 'required', message: 'Accept the terms to continue' };
}

export const FAULT_LABEL: Record<FaultCode, string> = {
	missing: 'Missing',
	short: 'Too short',
	long: 'Too long',
	chars: 'Bad character',
	malformed: 'Malformed',
	mismatch: 'Mismatch',
	required: 'Required'
};

// ---------------------------------------------------------------------------
// Password strength — advice only; the single hard rule is 8+ characters.
// ---------------------------------------------------------------------------
export type Score = 0 | 1 | 2 | 3 | 4;
export type StrengthLabel = '' | 'Weak' | 'Fair' | 'Good' | 'Strong';

export interface StrengthResult {
	score: Score;
	label: StrengthLabel;
}

const LABELS: readonly StrengthLabel[] = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export function scorePassword(pw: string): StrengthResult {
	if (pw === '') return { score: 0, label: '' };
	if (pw.length < 8) return { score: 1, label: 'Weak' };

	let points = 0;
	if (pw.length >= 8) points++;
	if (pw.length >= 12) points++;
	if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) points++;
	if (/[0-9]/.test(pw)) points++;
	if (/[^A-Za-z0-9]/.test(pw)) points++;

	const score = Math.min(points, 4) as Score;
	return { score, label: LABELS[score] };
}
