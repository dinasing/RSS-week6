import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

const TEST_MODAL_TITLE = 'Test Modal';
const TEST_MODAL_CONTENT = <p>Content</p>;

function renderTestModal({
  isOpen = true,
  onClose = () => {},
  title = TEST_MODAL_TITLE,
  children = TEST_MODAL_CONTENT,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children?: ReactNode;
} = {}) {
  return render(
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      {children}
    </Modal>,
  );
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('renders portal into document.body when open', () => {
    renderTestModal();

    const dialog = screen.getByRole('dialog');
    expect(document.body.contains(dialog)).toBe(true);
    expect(screen.getByText(TEST_MODAL_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderTestModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    renderTestModal({ onClose });

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderTestModal({ onClose });

    await user.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when dialog content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderTestModal({
      onClose,
      children: <button type="button">Inner action</button>,
    });

    await user.click(screen.getByRole('button', { name: 'Inner action' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = renderTestModal();

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} title={TEST_MODAL_TITLE} onClose={() => {}}>
        {TEST_MODAL_CONTENT}
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('');
  });
});
