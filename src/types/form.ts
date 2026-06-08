export type FormSource = 'uncontrolled' | 'rhf';

export interface FormSubmission {
  id: string;
  source: FormSource;
  submittedAt: number;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  imageBase64: string;
}

export type FormSubmissionInput = Omit<
  FormSubmission,
  'id' | 'submittedAt'
>;
