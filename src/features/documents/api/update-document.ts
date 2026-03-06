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
  file?: File;
};

export const updateDocument = (input: UpdateDocumentInput) => {
  const { documentId, file, ...data } = input;

  if (file) {
    const formData = new FormData();
    formData.append('name', data.name ?? '');
    formData.append('issuer', data.issuer ?? '');
    formData.append('issueDate', data.issueDate ?? '');
    formData.append('dueDate', data.dueDate ?? '');
    formData.append('number', data.number ?? '');
    formData.append('remarks', data.remarks ?? '');
    formData.append('file', file);
    return apiClient.patch<Document>(`/v1/documents/${documentId}`, formData);
  }

  return apiClient.patch<Document>(`/v1/documents/${documentId}`, data);
};
