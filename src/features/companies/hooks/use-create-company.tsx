import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCompany, type CreateCompanyInput } from '../api/create-company';

import { getCompaniesSummaryKey } from './use-get-companies-summary';

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCompanyInput) => createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getCompaniesSummaryKey],
      });
    },
  });
};
