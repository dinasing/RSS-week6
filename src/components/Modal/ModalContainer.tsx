import { useState } from 'react';

import ControlledForm from '../ControlledForm/ControlledForm';
import UncontrolledForm from '../UncontrolledForm/UncontrolledForm';
import Modal from './Modal';

export default function ModalContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'controlled' | 'uncontrolled'>(
    'controlled'
  );

  return (
    <div>
      <section>
        <Modal
          title="Personal data"
          onClose={() => {
            setIsOpen(false);
          }}
          isOpen={isOpen}
        >
          <button
            type="button"
            className="button"
            onClick={() =>
              setActiveForm((current) =>
                current === 'controlled' ? 'uncontrolled' : 'controlled'
              )
            }
          >
            {activeForm === 'controlled'
              ? 'Switch to Uncontrolled Form'
              : 'Switch to Controlled Form'}
          </button>
          {activeForm === 'controlled' ? (
            <ControlledForm />
          ) : (
            <UncontrolledForm />
          )}
        </Modal>
        <button
          type="button"
          className="button"
          onClick={() => setIsOpen(true)}
        >
          Open Form
        </button>
      </section>
    </div>
  );
}
