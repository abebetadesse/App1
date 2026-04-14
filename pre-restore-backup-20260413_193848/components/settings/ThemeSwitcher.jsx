import React, { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button } from 'react-bootstrap';

const ThemeSwitcher = forwardRef((props, ref) {
  const { themeId, changeTheme, availableThemes, currentTheme } = useTheme();

  return (
    <Card className="mb-4">
      <Card.Header>🎨 Theme Marketplace</Card.Header>
      <Card.Body>
        <div className="row">
          {availableThemes.map(theme => (
            <div key={theme.id} className="col-md-3 col-sm-6 mb-3">
              <Button
                variant={themeId === theme.id ? 'primary' : 'outline-secondary'}
                onClick={() => changeTheme(theme.id)}
                className="w-100 text-start d-flex align-items-center gap-2"
                style={{ justifyContent: 'flex-start' }}
              >
                <span>{theme.icon}</span>
                <span>{theme.name}</span>
                {themeId === theme.id && <span className="ms-auto">✓</span>}
              </Button>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
ThemeSwitcher.displayName = 'ThemeSwitcher';
