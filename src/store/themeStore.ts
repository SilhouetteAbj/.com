import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set: any) => ({
  theme: 'light',

  toggleTheme: () => {
    set((state: ThemeStore) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  setTheme: (theme: Theme) => {
    set({ theme });
  },
}));
