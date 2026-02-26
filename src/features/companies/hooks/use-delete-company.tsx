import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { deleteCompany } from '../api/delete-company';

import { getCompaniesSummaryKey } from './use-get-companies-summary';

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getCompaniesSummaryKey],
      });
      // Navigate back to companies list if we're on a company page
      router.navigate({ to: '/empresas' });
    },
  });
};
