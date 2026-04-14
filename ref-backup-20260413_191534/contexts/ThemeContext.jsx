import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, getAllThemes } from '../theme/themeRegistry';

const ThemeContext = createContext({});
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('active_theme') || 'default');
  const [availableThemes, setAvailableThemes] = useState(getAllThemes());

  useEffect(() => {
    const theme = getTheme(themeId);
    if (theme && theme.variables) {
      Object.entries(theme.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
    localStorage.setItem('active_theme', themeId);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [themeId]);

  const changeTheme = (id) => { if (getTheme(id)) setThemeId(id); };
  const toggleTheme = () => {
    const themes = getAllThemes();
    const currentIndex = themes.findIndex(t => t.id === themeId);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex].id);
  };

  // For backward compatibility (light/dark toggle)
  const theme = themeId === 'dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ themeId, theme, changeTheme, toggleTheme, availableThemes, currentTheme: getTheme(themeId) }}>
      {children}
    </ThemeContext.Provider>
  );
};
