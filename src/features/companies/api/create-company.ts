import { apiClient } from '@/lib/http-client';

import type { Company } from '../types/company';

export type CreateCompanyUserInput = {
  name: string;
  email: string;
};

export type CreateCompanyInput = {
  name: string;
  users?: CreateCompanyUserInput[];
};

export const createCompany = (input: CreateCompanyInput) => {
  return apiClient.post<Company>(`/v1/companies`, input);
};
