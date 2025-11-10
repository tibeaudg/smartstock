import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'stockflow-theme';

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    return storedValue === 'dark' ? 'dark' : storedValue === 'light' ? 'light' : null;
  } catch (error) {
    console.warn('[ThemeProvider] Failed to access localStorage:', error);
    return null;
  }
};

const persistTheme = (mode: ThemeMode) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch (error) {
    console.warn('[ThemeProvider] Failed to persist theme to localStorage:', error);
  }
};

const applyThemeClass = (mode: ThemeMode) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('data-theme', mode);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const initialTheme = getStoredTheme() ?? 'light';
    applyThemeClass(initialTheme);
    return initialTheme;
  });

  useLayoutEffect(() => {
    applyThemeClass(theme);

    return () => {
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.remove('dark');
        root.removeAttribute('data-theme');
      }
    };
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    persistTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prevMode => {
      const nextMode: ThemeMode = prevMode === 'dark' ? 'light' : 'dark';
      persistTheme(nextMode);
      return nextMode;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

