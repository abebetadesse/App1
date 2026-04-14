import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const SystemSettings = forwardRef((props, ref) {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({ siteName: 'Tham AI', maintenanceMode: false, registrationEnabled: true });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('system_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const saveSettings = () => {
    localStorage.setItem('system_settings', JSON.stringify(settings));
    setMessage({ type: 'success', text: 'Settings saved' });
    setTimeout(() => setMessage(''), 3000);
  };

  if (!isAdmin) return <Alert variant="danger">Access denied</Alert>;

  return (
    <Card>
      <Card.Header>System Settings</Card.Header>
      <Card.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form>
          <Form.Group className="mb-3"><Form.Label>Site Name</Form.Label><Form.Control value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} /></Form.Group>
          <Form.Group className="mb-3"><Form.Check type="switch" label="Maintenance Mode" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} /></Form.Group>
          <Form.Group className="mb-3"><Form.Check type="switch" label="Allow New Registrations" checked={settings.registrationEnabled} onChange={e => setSettings({...settings, registrationEnabled: e.target.checked})} /></Form.Group>
          <Button onClick={saveSettings}>Save Settings</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
SystemSettings.displayName = 'SystemSettings';
