import { z } from 'zod';

import { meetsPasswordStrength } from '../utils/passwordStrength';
import { validateEmail } from '../utils/validateEmail';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg'] as const;

const GENDER_OPTIONS = ['male', 'female', 'other'] as const;

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');

  if (parts.length < 2) {
    return '';
  }

  return parts.at(-1)?.toLowerCase() ?? '';
}

function isValidImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  const allowedExtensions = ['png', 'jpeg', 'jpg'];

  if (!allowedExtensions.includes(extension)) {
    return false;
  }

  if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number]
    )
  ) {
    return false;
  }

  return file.size <= MAX_IMAGE_SIZE_BYTES;
}

export function createFormSchema(countries: readonly string[]) {
  const countrySet = new Set(countries);

  return z
    .object({
      name: z.string().trim().min(1, 'Name is required'),
      age: z
        .union([z.string(), z.number()])
        .transform((value) =>
          typeof value === 'string' ? Number(value) : value
        )
        .pipe(
          z
            .number({ message: 'Age must be a number' })
            .refine((value) => !Number.isNaN(value), {
              message: 'Age must be a number',
            })
            .refine((value) => value >= 0, {
              message: 'Age cannot be negative',
            })
        ),
      email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .refine((value) => validateEmail(value), {
          message: 'Invalid email address',
        }),
      gender: z.enum(GENDER_OPTIONS, {
        message: 'Please select a gender',
      }),
      acceptTerms: z.boolean().refine((value) => value, {
        message: 'You must accept the terms and conditions',
      }),
      password: z
        .string()
        .min(1, 'Password is required')
        .refine((value) => meetsPasswordStrength(value), {
          message:
            'Password must include 1 number, 1 uppercase, 1 lowercase, and 1 special character',
        }),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
      image: z
        .custom<File>((value) => value instanceof File, {
          message: 'Image is required',
        })
        .refine((file) => file.size > 0, { message: 'Image is required' })
        .refine((file) => isValidImageFile(file), {
          message: 'Image must be PNG or JPEG and no larger than 5 MB',
        }),
      country: z
        .string()
        .trim()
        .min(1, 'Country is required')
        .refine((value) => countrySet.has(value), {
          message: 'Please select a valid country from the list',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });
}

export type FormSchema = ReturnType<typeof createFormSchema>;
export type FormValues = z.infer<FormSchema>;
export type FormInput = z.input<FormSchema>;

export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === 'string' && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

export { GENDER_OPTIONS };
