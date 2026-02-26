import { useMutation } from '@tanstack/react-query';

import { updatePassword, type UpdatePasswordInput } from '../api/update-password';

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (input: UpdatePasswordInput) => updatePassword(input),
  });
};
