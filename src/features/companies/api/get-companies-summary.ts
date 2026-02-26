import { apiClient } from '@/lib/http-client';

import type { CompaniesSummary } from '../types/companies-summary';

export const getCompaniesSummary = () => {
  return apiClient.get<CompaniesSummary[]>(`/v1/companies/summary`);
};
