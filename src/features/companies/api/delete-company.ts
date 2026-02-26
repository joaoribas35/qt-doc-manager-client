import { apiClient } from '@/lib/http-client';

import type { Company } from '../types/company';

export const deleteCompany = (companyId: string) => {
  return apiClient.delete<Company>(`/v1/companies/${companyId}`);
};
