import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCompanyById } from '../api/get-company-by-id';
import type { Company } from '../types/company';

export const getCompanyByIdKey = 'getCompanyByIdKey';

export const useGetCompanyById = (companyId: string | null, enabled: boolean): UseQueryResult<Company> => {
  return useQuery<Company>({
    queryKey: [getCompanyByIdKey, companyId],
    queryFn: () => {
      if (!companyId) {
        throw new Error('companyId is required');
      }

      return getCompanyById(companyId);
    },
    enabled: !!companyId && enabled,
  });
};

