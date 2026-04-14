import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { themes, getTheme, getAllThemes } from '../../theme/themeRegistry';

const ThemeMarketplace = forwardRef((props, ref) {
  const { themeId, changeTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(null);
  const allThemes = getAllThemes();

  const applyPreview = (theme) => {
    setPreviewTheme(theme);
    Object.entries(theme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  const clearPreview = () => {
    setPreviewTheme(null);
    const current = getTheme(themeId);
    Object.entries(current.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  const applyTheme = (id) => {
    changeTheme(id);
    setPreviewTheme(null);
  };

  return (
    <div>
      <h4 className="mb-3">Theme Marketplace</h4>
      {previewTheme && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>Previewing: <strong>{previewTheme.name}</strong></span>
          <div>
            <Button size="sm" variant="success" onClick={() => applyTheme(previewTheme.id)} className="me-2">Apply</Button>
            <Button size="sm" variant="secondary" onClick={clearPreview}>Cancel</Button>
          </div>
        </div>
      )}
      <Row>
        {allThemes.map(theme => (
          <Col md={4} sm={6} key={theme.id} className="mb-3">
            <Card className={`h-100 ${themeId === theme.id ? 'border-primary' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <Card.Title>{theme.icon} {theme.name}</Card.Title>
                  {themeId === theme.id && <Badge bg="primary">Active</Badge>}
                </div>
                <Card.Text className="small text-muted">
                  Primary: {theme.variables['--primary']}<br />
                  Background: {theme.variables['--bg-primary']}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => applyPreview(theme)}>Preview</Button>
                  <Button size="sm" variant="primary" onClick={() => applyTheme(theme.id)}>Apply</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
ThemeMarketplace.displayName = 'ThemeMarketplace';
