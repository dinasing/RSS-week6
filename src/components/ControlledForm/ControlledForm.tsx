import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  createFormSchema,
  GENDER_OPTIONS,
  type FormInput,
  type FormValues,
} from '../../schemas/formSchema';
import { useFormStore } from '../../store/useFormStore';
import { imageToBase64 } from '../../utils/imageToBase64';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import FormField from '../FormField/FormField';
import PasswordStrength from '../PasswordStrength/PasswordStrength';

interface ControlledFormProps {
  onSuccess: (submissionId: string) => void;
}

function ControlledForm({ onSuccess }: ControlledFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: undefined,
      acceptTerms: false,
      password: '',
      confirmPassword: '',
      country: '',
      image: undefined,
    },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = async (data: FormValues) => {
    const imageBase64 = await imageToBase64(data.image);
    const submissionId = addSubmission({
      source: 'rhf',
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      country: data.country,
      imageBase64,
    });

    reset();
    onSuccess(submissionId);
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          className="form-input"
          {...register('name')}
        />
      </FormField>

      <FormField label="Age" htmlFor="age" error={errors.age?.message}>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          min={1}
          max={120}
          aria-invalid={Boolean(errors.age)}
          className="form-input"
          {...register('age')}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className="form-input"
          {...register('email')}
        />
      </FormField>

      <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
        <select
          id="gender"
          aria-invalid={Boolean(errors.gender)}
          className="form-input"
          {...register('gender')}
        >
          <option value="" disabled>
            Select gender
          </option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Country"
        htmlFor="country"
        error={errors.country?.message}
      >
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              id="country"
              value={field.value}
              countries={countries}
              error={errors.country?.message}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <FormField
        label="Profile Image"
        htmlFor="image"
        error={errors.image?.message}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <input
              id="image"
              ref={ref}
              type="file"
              accept="image/png,image/jpeg"
              aria-invalid={Boolean(errors.image)}
              className="form-input"
              onChange={(event) => {
                const file = event.target.files?.[0];
                onChange(file);
              }}
            />
          )}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          className="form-input"
          {...register('password')}
        />
        <PasswordStrength password={passwordValue} />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          className="form-input"
          {...register('confirmPassword')}
        />
      </FormField>

      <FormField
        label="Terms and Conditions"
        htmlFor="acceptTerms"
        error={errors.acceptTerms?.message}
      >
        <label className="form-label">
          <input
            id="acceptTerms"
            type="checkbox"
            className="form-checkbox"
            aria-invalid={Boolean(errors.acceptTerms)}
            {...register('acceptTerms')}
          />
          I accept the Terms and Conditions
        </label>
      </FormField>

      <button
        type="submit"
        className="button"
        disabled={!isValid || isSubmitting}
      >
        Submit
      </button>
    </form>
  );
}

export default ControlledForm;
