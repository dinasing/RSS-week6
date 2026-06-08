import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import './ControlledForm.css';

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
        .max(120, 'Age must be at most 120')
    ),
  email: z.email('Invalid email address'),
  gender: z.enum(GENDER_OPTIONS, { message: 'Please select a gender' }),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'You must accept the terms and conditions',
  }),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const defaultValues: FormInput = {
  fullName: '',
  age: '1',
  email: '',
  gender: 'female',
  acceptTerms: false,
};

function ControlledForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: FormOutput) => {
    console.log(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          className="form-input"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p id="fullName-error" className="form-error" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          min={1}
          max={120}
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? 'age-error' : undefined}
          className="form-input"
          {...register('age')}
        />
        {errors.age && (
          <p id="age-error" className="form-error" role="alert">
            {errors.age.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="form-input"
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="form-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          aria-invalid={Boolean(errors.gender)}
          aria-describedby={errors.gender ? 'gender-error' : undefined}
          className="form-input"
          {...register('gender')}
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {errors.gender && (
          <p id="gender-error" className="form-error" role="alert">
            {errors.gender.message}
          </p>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">
          <input
            id="acceptTerms"
            type="checkbox"
            className="form-checkbox"
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={
              errors.acceptTerms ? 'acceptTerms-error' : undefined
            }
            {...register('acceptTerms')}
          />
          Accept Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <p id="acceptTerms-error" className="form-error" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <button type="submit" className="button" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default ControlledForm;
