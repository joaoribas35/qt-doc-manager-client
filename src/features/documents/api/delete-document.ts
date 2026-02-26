import { apiClient } from '@/lib/http-client';

export const deleteDocument = (documentId: string) => {
  return apiClient.delete(`/v1/documents/${documentId}`);
};
