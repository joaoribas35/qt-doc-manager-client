import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { getCompaniesSummaryKey } from '@/features/companies/hooks/use-get-companies-summary';

import { deleteDocument } from '../api/delete-document';

import { getCompanyDocumentsKey } from './use-get-company-documents';

export const useDeleteDocument = (companySlug?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      if (companySlug) {
        queryClient.invalidateQueries({
          queryKey: [getCompanyDocumentsKey, companySlug],
          refetchType: 'all',
        });

        queryClient.invalidateQueries({
          queryKey: [getCompaniesSummaryKey],
          refetchType: 'all',
        });

        router.navigate({ to: `/empresas/${companySlug}/documentos` });
      }
    },
  });
};
