import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getDocumentById } from '../api/get-document-by-id';
import type { Document } from '../types/document';

export const getDocumentByIdKey = 'getDocumentByIdKey';

export const useGetDocumentById = (documentId: string): UseQueryResult<Document> => {
  return useQuery({
    queryKey: [getDocumentByIdKey, documentId],
    queryFn: () => getDocumentById(documentId),
  });
};
