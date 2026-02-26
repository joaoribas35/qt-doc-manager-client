import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { apiClient } from '@/lib/http-client';
import { useUserStore } from '@/store/user.store';
import type { LoginFormInput, PasswordRecoveryInput } from '@/types/auth.types';
import type { User } from '@/types/user.types';

export const useLogin = () => {
  const setUser = useUserStore(state => state.setUser);

  return useMutation({
    mutationFn: (data: LoginFormInput): Promise<User> => apiClient.post('/v1/auth/login', data),
    onSuccess: (user: User) => {
      setUser(user);
    },
  });
};

export const useLogout = () => {
  const setUser = useUserStore(state => state.setUser);
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => apiClient.post('/v1/auth/logout'),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      localStorage.clear();
      router.navigate({ to: '/' });
    },
  });
};

export const usePasswordRecovery = () => {
  return useMutation({
    mutationFn: (data: PasswordRecoveryInput): Promise<void> => apiClient.post('/v1/auth/reset-password', data),
  });
};
