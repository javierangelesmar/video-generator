'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'doctor' | 'patient';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'doctor',
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = 'doctor',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem('ducktor-theme') as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('ducktor-theme', t);
    document.documentElement.dataset.theme = t;
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle: () => setTheme(theme === 'doctor' ? 'patient' : 'doctor') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
