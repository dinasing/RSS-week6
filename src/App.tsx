import { useEffect, useState } from 'react';

import ModalContainer from './components/Modal/ModalContainer';
import SubmissionCard from './components/SubmissionCard/SubmissionCard';
import { useFormStore } from './store/useFormStore';

function App() {
  const submissions = useFormStore((state) => state.submissions);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedId(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [highlightedId]);

  const handleSuccess = (submissionId: string) => {
    setHighlightedId(submissionId);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Form Submissions</h1>
        <p>
          Submit personal data using an uncontrolled form or React Hook Form.
          Successful submissions appear below.
        </p>
        <ModalContainer onSuccess={handleSuccess} />
      </header>

      <section className="submissions-section">
        <h2>Submitted Forms</h2>
        {submissions.length === 0 ? (
          <p className="submissions-empty">No submissions yet.</p>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isHighlighted={submission.id === highlightedId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
