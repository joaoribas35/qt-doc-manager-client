import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getCompaniesSummaryKey } from '@/features/companies/hooks/use-get-companies-summary';
import { formatDateToNoon } from '@/utils/format-date';

import { createDocument, type CreateDocumentInput } from '../api/create-document';

import { getCompanyDocumentsKey } from './use-get-company-documents';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => {
      return createDocument({
        ...input,
        issueDate: formatDateToNoon(input.issueDate ? input.issueDate : ''),
        dueDate: formatDateToNoon(input.dueDate ? input.dueDate : ''),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [getCompanyDocumentsKey, variables.companySlug],
      });

      queryClient.invalidateQueries({
        queryKey: [getCompaniesSummaryKey],
      });
    },
  });
};
