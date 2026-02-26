import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { env } from '@/config/env';
import type { User } from '@/types/user.types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
    }),
    {
      name: env.USER_STORAGE_KEY,
    }
  )
);
