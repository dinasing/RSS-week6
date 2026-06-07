import { useState } from 'react';
import Modal from './components/Modal/Modal';
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <h1>Form validation with react-hook-form and zod</h1>

      <Modal
        title="Modal Title"
        onClose={() => {
          setIsOpen(false);
        }}
        isOpen={isOpen}
      >
        Modal Content
      </Modal>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
    </>
  );
}

export default App;
