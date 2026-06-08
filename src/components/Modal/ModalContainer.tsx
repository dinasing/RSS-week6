import { useState } from 'react';

import ControlledForm from '../ControlledForm/ControlledForm';
import UncontrolledForm from '../UncontrolledForm/UncontrolledForm';
import Modal from './Modal';

const FORM_TYPES = {
  CONTROLLED: 'controlled',
  UNCONTROLLED: 'uncontrolled',
} as const;

type FormType = (typeof FORM_TYPES)[keyof typeof FORM_TYPES];

interface ModalContainerProps {
  onSuccess: (submissionId: string) => void;
}

export default function ModalContainer({ onSuccess }: ModalContainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(
    FORM_TYPES.UNCONTROLLED,
  );
  const [formKey, setFormKey] = useState(0);

  const closeModal = () => {
    setIsOpen(false);
    setFormKey((current) => current + 1);
  };

  const handleSuccess = (submissionId: string) => {
    onSuccess(submissionId);
    closeModal();
  };

  const modalTitle =
    activeForm === FORM_TYPES.UNCONTROLLED
      ? 'Uncontrolled Form'
      : 'Controlled Form';

  return (
    <section>
      <Modal isOpen={isOpen} title={modalTitle} onClose={closeModal}>
        <button
          type="button"
          className="button"
          onClick={() =>
            setActiveForm((current) =>
              current === FORM_TYPES.CONTROLLED
                ? FORM_TYPES.UNCONTROLLED
                : FORM_TYPES.CONTROLLED,
            )
          }
        >
          {activeForm === FORM_TYPES.CONTROLLED
            ? 'Switch to Uncontrolled Form'
            : 'Switch to Controlled Form'}
        </button>
        {activeForm === FORM_TYPES.UNCONTROLLED ? (
          <UncontrolledForm key={formKey} onSuccess={handleSuccess} />
        ) : (
          <ControlledForm key={formKey} onSuccess={handleSuccess} />
        )}
      </Modal>
      <button type="button" className="button" onClick={() => setIsOpen(true)}>
        Open Form
      </button>
    </section>
  );
}
