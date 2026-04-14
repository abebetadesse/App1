import React from "react";
/* eslint-disable no-unused-vars */
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { toggleTheme, isDark, isSystem, themeInfo } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${themeInfo.resolvedType} (${isSystem ? 'system' : 'manual'})`}
    >
      {isDark ? '☀️' : '🌙'}
      <span className="theme-status">
        {isSystem && '🖥️'}
      </span>
    </button>
  );
};

export default ThemeToggle;