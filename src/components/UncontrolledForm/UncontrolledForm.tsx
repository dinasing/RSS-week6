import { useId, useState } from 'react';
import { z } from 'zod';

const GENDER_OPTIONS = ['female', 'male'] as const;

const formSchema = z.object({
  fullName: z.string().trim().min(3, 'Full name is required'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'Age must be a number',
    })
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .int('Age must be a whole number')
        .min(1, 'Age must be at least 1')
        .max(120, 'Age must be at most 120'),
    ),
  email: z.email('Invalid email address'),
  gender: z.enum(GENDER_OPTIONS, { message: 'Please select a gender' }),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormInput = z.input<typeof formSchema>;
type FieldName = keyof FormInput;
type FieldErrors = Partial<Record<FieldName, string>>;

function getFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && !fieldErrors[field as FieldName]) {
      fieldErrors[field as FieldName] = issue.message;
    }
  }

  return fieldErrors;
}

export default function UncontrolledForm() {
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});

  const fieldId = (name: string) => `${formId}-${name}`;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = formSchema.safeParse({
      fullName: formData.get('fullName'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      acceptTerms: formData.get('acceptTerms') === 'on',
    });

    if (!result.success) {
      setErrors(getFieldErrors(result.error));
      return;
    }

    setErrors({});
    console.log(result.data);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={fieldId('fullName')}>Full Name</label>
        <input
          id={fieldId('fullName')}
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue=""
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={
            errors.fullName ? fieldId('fullName-error') : undefined
          }
          className="form-input"
        />
        {errors.fullName && (
          <p
            id={fieldId('fullName-error')}
            className="form-error"
            role="alert"
          >
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={fieldId('age')}>Age</label>
        <input
          id={fieldId('age')}
          name="age"
          type="number"
          inputMode="numeric"
          min={1}
          max={120}
          defaultValue="1"
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? fieldId('age-error') : undefined}
          className="form-input"
        />
        {errors.age && (
          <p id={fieldId('age-error')} className="form-error" role="alert">
            {errors.age}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={fieldId('email')}>Email</label>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue=""
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? fieldId('email-error') : undefined}
          className="form-input"
        />
        {errors.email && (
          <p id={fieldId('email-error')} className="form-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={fieldId('gender')}>Gender</label>
        <select
          id={fieldId('gender')}
          name="gender"
          defaultValue="female"
          aria-invalid={Boolean(errors.gender)}
          aria-describedby={errors.gender ? fieldId('gender-error') : undefined}
          className="form-input"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {errors.gender && (
          <p id={fieldId('gender-error')} className="form-error" role="alert">
            {errors.gender}
          </p>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">
          <input
            id={fieldId('acceptTerms')}
            name="acceptTerms"
            type="checkbox"
            className="form-checkbox"
            defaultChecked={false}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={
              errors.acceptTerms ? fieldId('acceptTerms-error') : undefined
            }
          />
          Accept Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <p
            id={fieldId('acceptTerms-error')}
            className="form-error"
            role="alert"
          >
            {errors.acceptTerms}
          </p>
        )}
      </div>

      <button type="submit" className="button">
        Submit
      </button>
    </form>
  );
}
