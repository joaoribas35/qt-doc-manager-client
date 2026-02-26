import { apiClient } from '@/lib/http-client';

import type { Document } from '../types/document';

export const getDocuments = (companySlug: string): Promise<Document[]> => {
  return apiClient.get<Document[]>(`/v1/companies/${companySlug}/documents`) as Promise<Document[]>;
};
