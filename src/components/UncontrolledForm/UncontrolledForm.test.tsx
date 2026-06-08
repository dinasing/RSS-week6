import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { COUNTRIES } from '../../data/countries';
import { useFormStore } from '../../store/useFormStore';
import { imageToBase64 } from '../../utils/imageToBase64';
import UncontrolledForm from './UncontrolledForm';

vi.mock('../../utils/imageToBase64', () => ({
  imageToBase64: vi.fn(async () => 'data:image/png;base64,abc'),
}));

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
    vi.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<UncontrolledForm onSuccess={() => {}} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Image')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Terms and Conditions'),
    ).toBeInTheDocument();
  });

  it('shows validation errors on invalid submit', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('stores submission data on valid submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<UncontrolledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '30');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'male');
    await user.type(screen.getByLabelText('Country'), COUNTRIES[0]!);
    await user.click(screen.getByRole('option', { name: COUNTRIES[0]! }));
    await user.type(screen.getByLabelText('Password'), 'Abcdef1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Abcdef1!');

    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Profile Image'), file);
    await user.click(screen.getByLabelText('Terms and Conditions'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    expect(imageToBase64).toHaveBeenCalled();
    expect(useFormStore.getState().submissions).toHaveLength(1);
    expect(useFormStore.getState().submissions[0]?.source).toBe('uncontrolled');
  });
});
