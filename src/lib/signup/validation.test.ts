import { describe, it, expect } from 'vitest';
import {
	validateCallsign,
	validateEmail,
	validatePassword,
	validateConfirm,
	validateTerms,
	scorePassword
} from './validation';

describe('validateCallsign', () => {
	it('rejects an empty / whitespace-only callsign', () => {
		expect(validateCallsign('')?.code).toBe('missing');
		expect(validateCallsign('   ')?.code).toBe('missing');
	});
	it('rejects fewer than 3 characters (trimmed)', () => {
		expect(validateCallsign('ab')?.code).toBe('short');
		expect(validateCallsign('  ab  ')?.code).toBe('short');
	});
	it('rejects more than 20 characters', () => {
		expect(validateCallsign('a'.repeat(21))?.code).toBe('long');
	});
	it('rejects characters outside letters, numbers, _ and -', () => {
		expect(validateCallsign('neon core')?.code).toBe('chars');
		expect(validateCallsign('neon!')?.code).toBe('chars');
	});
	it('accepts a valid callsign', () => {
		expect(validateCallsign('NeonRaider_99')).toBeNull();
		expect(validateCallsign('vortex-07')).toBeNull();
	});
});

describe('validateEmail', () => {
	it('rejects empty and malformed addresses', () => {
		expect(validateEmail('')?.code).toBe('missing');
		expect(validateEmail('operator@')?.code).toBe('malformed');
		expect(validateEmail('operator@neoncore')?.code).toBe('malformed');
		expect(validateEmail('no-at.gg')?.code).toBe('malformed');
	});
	it('accepts a well-formed address', () => {
		expect(validateEmail('operator@neoncore.gg')).toBeNull();
	});
});

describe('validatePassword', () => {
	it('requires 8+ characters', () => {
		expect(validatePassword('')?.code).toBe('missing');
		expect(validatePassword('ab12')?.code).toBe('short');
		expect(validatePassword('abcd1234')).toBeNull();
	});
});

describe('validateConfirm', () => {
	it('requires a value that matches the password', () => {
		expect(validateConfirm('', 'secret12')?.code).toBe('missing');
		expect(validateConfirm('nope', 'secret12')?.code).toBe('mismatch');
		expect(validateConfirm('secret12', 'secret12')).toBeNull();
	});
});

describe('validateTerms', () => {
	it('requires acceptance', () => {
		expect(validateTerms(false)?.code).toBe('required');
		expect(validateTerms(true)).toBeNull();
	});
});

describe('scorePassword', () => {
	it('shows no meter for an empty field', () => {
		expect(scorePassword('')).toEqual({ score: 0, label: '' });
	});
	it('is always Weak below 8 characters', () => {
		expect(scorePassword('Ab1!')).toEqual({ score: 1, label: 'Weak' });
	});
	// Examples straight from the challenge brief.
	it('matches the brief examples', () => {
		expect(scorePassword('neoncore').label).toBe('Weak');
		expect(scorePassword('neoncore99').label).toBe('Fair');
		expect(scorePassword('Neoncore99').label).toBe('Good');
		expect(scorePassword('Tr4nsm1t!Nexus').label).toBe('Strong');
	});
	it('caps the score at 4', () => {
		expect(scorePassword('Tr4nsm1t!Nexus').score).toBe(4);
	});
});
