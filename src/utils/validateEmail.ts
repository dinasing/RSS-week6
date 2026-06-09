export function validateEmail(email: string): boolean {
  const atIndex = email.indexOf('@');

  if (atIndex === -1) {
    return false;
  }

  if (email.indexOf('@', atIndex + 1) !== -1) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (localPart.length === 0) {
    return false;
  }

  if (domain.length === 0) {
    return false;
  }

  if (domain.indexOf('.') === -1) {
    return false;
  }

  return true;
}
