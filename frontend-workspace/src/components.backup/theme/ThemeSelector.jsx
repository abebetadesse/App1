import React from "react";
/* eslint-disable no-unused-vars */
import { useTheme, THEME_TYPES, COLOR_SCHEMES, COLOR_PALETTES } from '../../contexts/ThemeContext';

const ThemeSelector = () => {
  const {
    themeType,
    colorScheme,
    setThemeType,
    setColorScheme,
    themeInfo
  } = useTheme();

  return (
    <div className="theme-selector">
      <div className="theme-section">
        <h4>Theme Mode</h4>
        <div className="theme-options">
          {Object.values(THEME_TYPES).map(type => (
            <button
              key={type}
              onClick={() => setThemeType(type)}
              className={`theme-option ${themeType === type ? 'active' : ''}`}
              data-theme-type={type}
            >
              {type === 'light' && '☀️ Light'}
              {type === 'dark' && '🌙 Dark'}
              {type === 'system' && '🖥️ System'}
            </button>
          ))}
        </div>
      </div>

      <div className="theme-section">
        <h4>Color Scheme</h4>
        <div className="color-schemes">
          {Object.values(COLOR_SCHEMES).map(scheme => (
            <button
              key={scheme}
              onClick={() => setColorScheme(scheme)}
              className={`color-scheme ${colorScheme === scheme ? 'active' : ''}`}
              style={{
                '--scheme-color': COLOR_PALETTES[scheme].primary[500]
              }}
              title={COLOR_PALETTES[scheme].name}
            >
              <span className="scheme-dot" />
              <span className="scheme-name">
                {COLOR_PALETTES[scheme].name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="current-theme-info">
        <p>
          <strong>Active:</strong> {themeInfo.name} ({themeInfo.resolvedType})
        </p>
        <p className="theme-description">{themeInfo.description}</p>
      </div>
    </div>
  );
};

export default ThemeSelector;