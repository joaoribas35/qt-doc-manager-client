import { apiClient } from '@/lib/http-client';

import type { Document } from '../types/document';

export type UpdateDocumentInput = {
  documentId: string;
  name?: string;
  issuer?: string;
  issueDate?: string;
  dueDate?: string;
  number?: string;
  remarks?: string;
};

export const updateDocument = (input: UpdateDocumentInput) => {
  const { documentId, ...data } = input;
  return apiClient.patch<Document>(`/v1/documents/${documentId}`, data);
};
