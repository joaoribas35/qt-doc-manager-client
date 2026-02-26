import { apiClient } from '@/lib/http-client';

export type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export const updatePassword = (input: UpdatePasswordInput) => {
  return apiClient.patch<void>('/v1/users/password', input);
};
