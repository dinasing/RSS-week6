import { useId, useRef, useState } from 'react';

import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import FormField from '../FormField/FormField';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import {
  createFormSchema,
  getFieldErrors,
  GENDER_OPTIONS,
} from '../../schemas/formSchema';
import { useFormStore } from '../../store/useFormStore';
import { imageToBase64 } from '../../utils/imageToBase64';

interface UncontrolledFormProps {
  onSuccess: (submissionId: string) => void;
}

export default function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');

  const fieldId = (name: string) => `${formId}-${name}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const image = imageInputRef.current?.files?.[0];

    const payload = {
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      acceptTerms: formData.get('acceptTerms') === 'on',
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      image,
      country,
    };

    const result = createFormSchema(countries).safeParse(payload);

    if (!result.success) {
      setErrors(getFieldErrors(result.error));
      return;
    }

    const imageBase64 = await imageToBase64(result.data.image);
    const submissionId = addSubmission({
      source: 'uncontrolled',
      name: result.data.name,
      age: result.data.age,
      email: result.data.email,
      gender: result.data.gender,
      country: result.data.country,
      imageBase64,
    });

    setErrors({});
    setCountry('');
    setPassword('');
    formRef.current?.reset();
    onSuccess(submissionId);
  };

  return (
    <form
      ref={formRef}
      className="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormField label="Name" htmlFor={fieldId('name')} error={errors.name}>
        <input
          id={fieldId('name')}
          name="name"
          type="text"
          autoComplete="name"
          defaultValue=""
          aria-invalid={Boolean(errors.name)}
          className="form-input"
        />
      </FormField>

      <FormField label="Age" htmlFor={fieldId('age')} error={errors.age}>
        <input
          id={fieldId('age')}
          name="age"
          type="number"
          inputMode="numeric"
          min={0}
          defaultValue=""
          aria-invalid={Boolean(errors.age)}
          className="form-input"
        />
      </FormField>

      <FormField label="Email" htmlFor={fieldId('email')} error={errors.email}>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          autoComplete="email"
          defaultValue=""
          aria-invalid={Boolean(errors.email)}
          className="form-input"
        />
      </FormField>

      <FormField
        label="Gender"
        htmlFor={fieldId('gender')}
        error={errors.gender}
      >
        <select
          id={fieldId('gender')}
          name="gender"
          defaultValue=""
          aria-invalid={Boolean(errors.gender)}
          className="form-input"
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
        htmlFor={fieldId('country')}
        error={errors.country}
      >
        <CountryAutocomplete
          id={fieldId('country')}
          value={country}
          countries={countries}
          error={errors.country}
          onChange={setCountry}
        />
      </FormField>

      <FormField
        label="Profile Image"
        htmlFor={fieldId('image')}
        error={errors.image}
      >
        <input
          id={fieldId('image')}
          ref={imageInputRef}
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          aria-invalid={Boolean(errors.image)}
          className="form-input"
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor={fieldId('password')}
        error={errors.password}
      >
        <input
          id={fieldId('password')}
          name="password"
          type="password"
          autoComplete="new-password"
          defaultValue=""
          aria-invalid={Boolean(errors.password)}
          className="form-input"
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength password={password} />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor={fieldId('confirmPassword')}
        error={errors.confirmPassword}
      >
        <input
          id={fieldId('confirmPassword')}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          defaultValue=""
          aria-invalid={Boolean(errors.confirmPassword)}
          className="form-input"
        />
      </FormField>

      <FormField
        label="Terms and Conditions"
        htmlFor={fieldId('acceptTerms')}
        error={errors.acceptTerms}
      >
        <label className="form-label">
          <input
            id={fieldId('acceptTerms')}
            name="acceptTerms"
            type="checkbox"
            className="form-checkbox"
            aria-invalid={Boolean(errors.acceptTerms)}
          />
          I accept the Terms and Conditions
        </label>
      </FormField>

      <button type="submit" className="button">
        Submit
      </button>
    </form>
  );
}
