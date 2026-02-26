import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCompaniesSummary } from '../api/get-companies-summary';
import type { CompaniesSummary } from '../types/companies-summary';

export const getCompaniesSummaryKey = 'getCompaniesSummaryKey';

export const useGetCompaniesSummary = (): UseQueryResult<CompaniesSummary[]> => {
  return useQuery<CompaniesSummary[]>({
    queryKey: [getCompaniesSummaryKey],
    queryFn: () => getCompaniesSummary(),
  });
};
