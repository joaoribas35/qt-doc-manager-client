import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCompany, type UpdateCompanyInput } from '../api/update-company';

import { getCompaniesSummaryKey } from './use-get-companies-summary';

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCompanyInput) => updateCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getCompaniesSummaryKey],
      });
    },
  });
};

