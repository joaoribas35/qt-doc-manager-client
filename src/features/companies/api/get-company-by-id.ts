import { apiClient } from '@/lib/http-client';

import type { Company } from '../types/company';

export const getCompanyById = (companyId: string) => {
  return apiClient.get<Company>(`/v1/companies/${companyId}`);
};
