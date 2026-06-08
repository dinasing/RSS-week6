import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      <p
        id={errorId}
        className="form-error"
        role={error ? 'alert' : undefined}
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}
