import { beforeEach, describe, expect, it } from 'vitest';

import { useFormStore } from './useFormStore';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it('initializes countries from seed data', () => {
    expect(useFormStore.getState().countries.length).toBeGreaterThan(0);
    expect(useFormStore.getState().countries).toContain('United States');
  });

  it('adds submissions to history and returns an id', () => {
    const id = useFormStore.getState().addSubmission({
      source: 'uncontrolled',
      name: 'John',
      age: 30,
      email: 'john@example.com',
      gender: 'male',
      country: 'United States',
      imageBase64: 'data:image/png;base64,abc',
    });

    const { submissions } = useFormStore.getState();

    expect(id).toBeTruthy();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.id).toBe(id);
    expect(submissions[0]?.name).toBe('John');
  });

  it('prepends new submissions', () => {
    useFormStore.getState().addSubmission({
      source: 'uncontrolled',
      name: 'First',
      age: 20,
      email: 'first@example.com',
      gender: 'female',
      country: 'Canada',
      imageBase64: 'data:image/png;base64,first',
    });

    useFormStore.getState().addSubmission({
      source: 'rhf',
      name: 'Second',
      age: 21,
      email: 'second@example.com',
      gender: 'male',
      country: 'Canada',
      imageBase64: 'data:image/png;base64,second',
    });

    expect(useFormStore.getState().submissions[0]?.name).toBe('Second');
  });
});
