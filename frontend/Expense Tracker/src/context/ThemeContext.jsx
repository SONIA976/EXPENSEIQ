import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Remove existing themes
    root.classList.remove('theme-light', 'theme-butter-yellow', 'theme-dark', 'theme-light-blue');
    // Add new theme
    root.classList.add(`theme-${theme}`);
    
    // Also toggle standard 'dark' class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
