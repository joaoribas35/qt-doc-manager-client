import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getDocuments } from '../api/get-company-documents';
import type { Document } from '../types/document';

export const getCompanyDocumentsKey = 'getCompanyDocumentsKey';

export const useGetCompanyDocuments = (companySlug: string): UseQueryResult<Document[]> => {
  return useQuery({
    queryKey: [getCompanyDocumentsKey, companySlug],
    queryFn: () => getDocuments(companySlug),
  });
};
