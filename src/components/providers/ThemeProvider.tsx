"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeVariant = 'standard' | 'minimalist' | 'vibrante';

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
  theme: 'dark',
  themeVariant: 'standard',
  setTheme: () => null,
  setThemeVariant: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  defaultThemeVariant = 'standard',
  storageKey = 'valky-ui-theme',
  variantStorageKey = 'valky-ui-theme-variant',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [themeVariant, setThemeVariantState] = useState<ThemeVariant>(defaultThemeVariant);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
      const storedVariant = localStorage.getItem(variantStorageKey) as ThemeVariant | null;
      if (storedVariant) {
        setThemeVariantState(storedVariant);
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }
  }, [storageKey, variantStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    root.removeAttribute('data-theme-variant');
    if (themeVariant !== 'standard') {
      root.setAttribute('data-theme-variant', themeVariant);
    }
  }, [theme, themeVariant]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
    setThemeState(newTheme);
  };

  const setThemeVariant = (newVariant: ThemeVariant) => {
    try {
      localStorage.setItem(variantStorageKey, newVariant);
    } catch (e) {
      console.warn("Could not save variant to localStorage", e);
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
