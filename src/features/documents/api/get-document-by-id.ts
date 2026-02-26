import { apiClient } from '@/lib/http-client';

import type { Document } from '../types/document';

export const getDocumentById = (documentId: string): Promise<Document> => {
  return apiClient.get<Document>(`/v1/documents/${documentId}`) as Promise<Document>;
};
