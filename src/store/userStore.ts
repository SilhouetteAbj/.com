import { create } from 'zustand';
import type { User } from '@/types/index';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set: any) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
