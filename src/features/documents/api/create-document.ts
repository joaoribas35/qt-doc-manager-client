import { apiClient } from '@/lib/http-client';

import type { Document } from '../types/document';

export type CreateDocumentInput = {
  name: string;
  number?: string;
  issuer?: string;
  issueDate?: string;
  dueDate?: string;
  remarks?: string;
  companyId: string;
  companySlug: string;
  file?: File;
};

export const createDocument = (input: CreateDocumentInput) => {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('number', input.number ?? '');
  formData.append('issuer', input.issuer ?? '');
  formData.append('issueDate', input.issueDate ?? '');
  formData.append('dueDate', input.dueDate ?? '');
  formData.append('remarks', input.remarks ?? '');
  formData.append('companyId', input.companyId);
  formData.append('companySlug', input.companySlug);
  if (input.file) {
    formData.append('file', input.file);
  }

  return apiClient.post<Document>(`/v1/documents`, formData);
};
