import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { COUNTRIES } from '../../data/countries';
import { useFormStore } from '../../store/useFormStore';
import { imageToBase64 } from '../../utils/imageToBase64';
import ControlledForm from './ControlledForm';

vi.mock('../../utils/imageToBase64', () => ({
  imageToBase64: vi.fn(async () => 'data:image/png;base64,abc'),
}));

describe('ControlledForm', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
    vi.clearAllMocks();
  });

  it('disables submit when the form is invalid', () => {
    render(<ControlledForm onSuccess={() => {}} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('stores submission data on valid submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<ControlledForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), '28');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Country'), COUNTRIES[1]!);
    await user.click(screen.getByRole('option', { name: COUNTRIES[1]! }));
    await user.type(screen.getByLabelText('Password'), 'Abcdef1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Abcdef1!');

    const file = new File(['hello'], 'photo.jpeg', { type: 'image/jpeg' });
    await user.upload(screen.getByLabelText('Profile Image'), file);
    await user.click(screen.getByLabelText('Terms and Conditions'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    expect(imageToBase64).toHaveBeenCalled();
    expect(useFormStore.getState().submissions[0]?.source).toBe('rhf');
  });
});
