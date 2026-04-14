import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';

const themes = [
  { name: 'Default', url: '', icon: '🎨' },
  { name: 'Darkly', url: 'https://bootswatch.com/5/darkly/bootstrap.min.css', icon: '🌙' },
  { name: 'Cyborg', url: 'https://bootswatch.com/5/cyborg/bootstrap.min.css', icon: '🤖' },
  { name: 'Solar', url: 'https://bootswatch.com/5/solar/bootstrap.min.css', icon: '☀️' },
  { name: 'Minty', url: 'https://bootswatch.com/5/minty/bootstrap.min.css', icon: '🌿' },
  { name: 'Lux', url: 'https://bootswatch.com/5/lux/bootstrap.min.css', icon: '💎' },
  { name: 'Sketchy', url: 'https://bootswatch.com/5/sketchy/bootstrap.min.css', icon: '✏️' },
  { name: 'United', url: 'https://bootswatch.com/5/united/bootstrap.min.css', icon: '🇺🇸' }
];

export default function BootstrapThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('bootstrap_theme') || 'Default');

  useEffect(() => {
    const theme = themes.find(t => t.name === activeTheme);
    let link = document.querySelector('#bootswatch-theme');
    if (!link) {
      link = document.createElement('link');
      link.id = 'bootswatch-theme';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (theme && theme.url) link.href = theme.url;
    else link.remove();
    localStorage.setItem('bootstrap_theme', activeTheme);
  }, [activeTheme]);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {themes.find(t => t.name === activeTheme)?.icon} Theme: {activeTheme}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {themes.map(theme => (
          <Dropdown.Item key={theme.name} onClick={() => setActiveTheme(theme.name)} active={activeTheme === theme.name}>
            {theme.icon} {theme.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
