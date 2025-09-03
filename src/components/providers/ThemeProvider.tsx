
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeVariant = 'standard' | 'minimalist' | 'vibrante' | 'pilot';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultThemeVariant?: ThemeVariant;
  storageKey?: string;
  variantStorageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  themeVariant: ThemeVariant;
  setTheme: (theme: Theme) => void;
  setThemeVariant: (variant: ThemeVariant) => void;
}

const initialState: ThemeProviderState = {
  theme: 'light',
  themeVariant: 'standard',
  setTheme: () => null,
  setThemeVariant: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultThemeVariant = 'pilot',
  storageKey = 'ui-theme',
  variantStorageKey = 'ui-theme-variant',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [themeVariant, setThemeVariantState] = useState<ThemeVariant>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(variantStorageKey) as ThemeVariant) || defaultThemeVariant;
    }
    return defaultThemeVariant;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    root.removeAttribute('data-theme-variant');
    if (themeVariant !== 'standard') { // 'standard' is the default, no attribute needed
      root.setAttribute('data-theme-variant', themeVariant);
    }
  }, [theme, themeVariant]);

  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  };

  const setThemeVariant = (newVariant: ThemeVariant) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(variantStorageKey, newVariant);
    }
    setThemeVariantState(newVariant);
  };

  const value = {
    theme,
    themeVariant,
    setTheme,
    setThemeVariant,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
