import { useMutation, useQueryClient } from '@tanstack/react-query';

import { formatDateToNoon } from '@/utils/format-date';

import { updateDocument, type UpdateDocumentInput } from '../api/update-document';

import { getCompanyDocumentsKey } from './use-get-company-documents';
import { getDocumentByIdKey } from './use-get-document-by-id';

export const useUpdateDocument = (companySlug?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDocumentInput) => {
      return updateDocument({
        ...input,
        issueDate: input.issueDate ? formatDateToNoon(input.issueDate) : input.issueDate,
        dueDate: input.dueDate ? formatDateToNoon(input.dueDate) : input.dueDate,
      });
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific document
      queryClient.invalidateQueries({
        queryKey: [getDocumentByIdKey, variables.documentId],
      });

      if (companySlug) {
        queryClient.invalidateQueries({
          queryKey: [getCompanyDocumentsKey, companySlug],
        });
      }
    },
  });
};
