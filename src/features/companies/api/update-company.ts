import { apiClient } from '@/lib/http-client';

import type { Company } from '../types/company';

export type UpdateCompanyUserInput = {
  id?: string;
  name: string;
  email: string;
};

export type UpdateCompanyInput = {
  id: string;
  name: string;
  users: UpdateCompanyUserInput[];
};

export const updateCompany = (input: UpdateCompanyInput) => {
  return apiClient.patch<Company>(`/v1/companies/${input.id}`, input);
};
