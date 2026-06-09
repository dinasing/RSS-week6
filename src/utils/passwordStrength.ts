export interface PasswordCriteria {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
}

export function getPasswordCriteria(password: string): PasswordCriteria {
  let hasNumber = false;
  let hasUppercase = false;
  let hasLowercase = false;
  let hasSpecialChar = false;

  for (const char of password) {
    if (char >= '0' && char <= '9') {
      hasNumber = true;
    } else if (char >= 'A' && char <= 'Z') {
      hasUppercase = true;
    } else if (char >= 'a' && char <= 'z') {
      hasLowercase = true;
    } else {
      hasSpecialChar = true;
    }
  }

  return { hasNumber, hasUppercase, hasLowercase, hasSpecialChar };
}

export function meetsPasswordStrength(password: string): boolean {
  const criteria = getPasswordCriteria(password);

  return (
    criteria.hasNumber &&
    criteria.hasUppercase &&
    criteria.hasLowercase &&
    criteria.hasSpecialChar
  );
}
