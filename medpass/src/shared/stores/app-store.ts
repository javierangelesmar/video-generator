import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLocale } from '@/shared/constants/locales';

interface AppState {
  locale: SupportedLocale;
  theme: 'light' | 'dark';
  isLoading: boolean;
  setLocale: (locale: SupportedLocale) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: 'es',
      theme: 'light',
      isLoading: false,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'medpass-app',
      partialize: (state) => ({ locale: state.locale, theme: state.theme }),
    }
  )
);
