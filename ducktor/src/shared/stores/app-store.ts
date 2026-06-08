import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLocale } from '@/shared/constants/locales';

// Two explicit themes — never auto-invert (Docplanner/guide pattern)
export type AppTheme = 'doctor' | 'patient';

interface AppState {
  locale: SupportedLocale;
  theme: AppTheme;
  isLoading: boolean;
  setLocale: (locale: SupportedLocale) => void;
  setTheme: (theme: AppTheme) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'es',
      theme: 'doctor',
      isLoading: false,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.theme = theme;
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'ducktor-app',
      partialize: (state) => ({ locale: state.locale, theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.dataset.theme = state.theme;
        }
      },
    }
  )
);
