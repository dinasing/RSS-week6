import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const renderCloseButton = () => {
    return (
      <button
        type="button"
        aria-label="Close"
        className="inline-flex shrink-0 items-center justify-center rounded p-1 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    );
  };

  const renderTitle = () => {
    return (
      <h2 id={titleId} className="text-2xl font-bold">
        {title}
      </h2>
    );
  };

  const renderContent = () => {
    return <div className="flex flex-col gap-4">{children}</div>;
  };

  const renderShadow = () => {
    return (
      <div
        className="fixed top-0 left-0 h-full w-full bg-black/60"
        data-testid="modal-backdrop"
        onClick={onClose}
      />
    );
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed top-1/4 left-1/2 z-50 flex max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-auto rounded-lg bg-white p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-row justify-between gap-4">
          {renderTitle()}
          {renderCloseButton()}
        </div>
        {renderContent()}
      </div>
      {renderShadow()}
    </>,
    document.body,
  );
}

export default Modal;
