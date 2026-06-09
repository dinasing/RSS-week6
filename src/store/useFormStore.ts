import { create } from 'zustand';

import { COUNTRIES } from '../data/countries';
import type { FormSubmissionInput } from '../types/form';

interface FormStore {
  countries: string[];
  submissions: Array<FormSubmissionInput & { id: string; submittedAt: number }>;
  addSubmission: (data: FormSubmissionInput) => string;
}

export const useFormStore = create<FormStore>((set) => ({
  countries: [...COUNTRIES],
  submissions: [],
  addSubmission: (data) => {
    const id = crypto.randomUUID();
    const submission = {
      ...data,
      id,
      submittedAt: Date.now(),
    };

    set((state) => ({
      submissions: [submission, ...state.submissions],
    }));

    return id;
  },
}));
