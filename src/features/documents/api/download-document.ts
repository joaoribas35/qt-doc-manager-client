import { apiClient } from '@/lib/http-client';

export const downloadDocument = async (documentId: string, filename: string) => {
  const blob = await apiClient.getBlob(`/v1/documents/${documentId}/download`);

  // Create blob URL
  const url = window.URL.createObjectURL(blob);

  // Create temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
