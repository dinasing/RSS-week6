import { describe, expect, it } from 'vitest';

import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('a.b@mail.co.uk')).toBe(true);
  });

  it('rejects emails without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects emails with multiple @ symbols', () => {
    expect(validateEmail('user@@example.com')).toBe(false);
    expect(validateEmail('us@er@example.com')).toBe(false);
  });

  it('rejects emails with empty local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('rejects emails with empty domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('rejects domains without a dot', () => {
    expect(validateEmail('user@example')).toBe(false);
  });
});
