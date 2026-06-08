import { describe, expect, it } from 'vitest';

import {
  getPasswordCriteria,
  meetsPasswordStrength,
} from './passwordStrength';

describe('passwordStrength', () => {
  it('detects all password criteria', () => {
    expect(getPasswordCriteria('Abcdef1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialChar: true,
    });
  });

  it('reports missing criteria', () => {
    expect(getPasswordCriteria('abcdefgh')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: true,
      hasSpecialChar: false,
    });
  });

  it('validates strong passwords', () => {
    expect(meetsPasswordStrength('Abcdef1!')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(meetsPasswordStrength('password')).toBe(false);
    expect(meetsPasswordStrength('Password1')).toBe(false);
  });
});
