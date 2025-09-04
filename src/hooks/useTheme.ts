import { createContext, useContext, useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  autoMode: boolean;
  setTheme: (theme: Theme) => void;
  setAutoMode: (enabled: boolean) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeProvider() {
  const [theme, setThemeKV] = useKV<Theme>('app-theme', 'light');
  const [autoMode, setAutoModeKV] = useKV<boolean>('auto-dark-mode', true);
  
  useEffect(() => {
    const root = window.document.documentElement;
    let finalTheme = theme;
    
    // Auto dark mode based on time (6 PM to 6 AM)
    if (autoMode) {
      const hour = new Date().getHours();
      const isNightTime = hour >= 18 || hour < 6;
      finalTheme = isNightTime ? 'dark' : 'light';
    }
    
    root.setAttribute('data-theme', finalTheme);
    
    // Add class for additional styling if needed
    if (finalTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, autoMode]);

  const setTheme = (newTheme: Theme) => {
    setThemeKV(newTheme);
    // When manually setting theme, disable auto mode
    if (autoMode) {
      setAutoModeKV(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setAutoMode = (enabled: boolean) => {
    setAutoModeKV(enabled);
  };

  return {
    theme,
    autoMode,
    setTheme,
    setAutoMode,
    toggleTheme,
  };
}