import { describe, expect, it } from 'vitest';

import { COUNTRIES } from '../data/countries';
import { createFormSchema, MAX_IMAGE_SIZE_BYTES } from './formSchema';

const validPassword = 'Abcdef1!';

function createValidFile(name = 'photo.png', type = 'image/png', size = 1024) {
  return new File([new Uint8Array(size)], name, { type });
}

function createValidPayload() {
  return {
    name: 'John',
    age: 25,
    email: 'john@example.com',
    gender: 'male' as const,
    acceptTerms: true,
    password: validPassword,
    confirmPassword: validPassword,
    image: createValidFile(),
    country: COUNTRIES[0],
  };
}

describe('createFormSchema', () => {
  const schema = createFormSchema(COUNTRIES);

  it('accepts valid form data', () => {
    const result = schema.safeParse(createValidPayload());

    expect(result.success).toBe(true);
  });

  it('rejects negative age values', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      age: -1,
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid email addresses', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
  });

  it('requires matching passwords', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      confirmPassword: 'Different1!',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported image types', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      image: createValidFile('photo.gif', 'image/gif'),
    });

    expect(result.success).toBe(false);
  });

  it('rejects images larger than 5 MB', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      image: createValidFile(
        'photo.png',
        'image/png',
        MAX_IMAGE_SIZE_BYTES + 1
      ),
    });

    expect(result.success).toBe(false);
  });

  it('rejects countries not in the provided list', () => {
    const result = schema.safeParse({
      ...createValidPayload(),
      country: 'Atlantis',
    });

    expect(result.success).toBe(false);
  });
});
