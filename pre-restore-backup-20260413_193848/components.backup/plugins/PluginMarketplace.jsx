import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Form, Button, Alert } from 'react-bootstrap';
import { getAllPlugins, enablePlugin, disablePlugin, initPlugins } from '../../plugins/PluginLoader';

const PluginMarketplace = forwardRef((props, ref) {
  const [plugins, setPlugins] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    initPlugins();
    setPlugins(getAllPlugins());
  }, []);

  const togglePlugin = (id, enabled) => {
    if (enabled) {
      enablePlugin(id);
      setMessage({ type: 'success', text: `${plugins.find(p => p.id === id)?.name} enabled` });
    } else {
      disablePlugin(id);
      setMessage({ type: 'info', text: `${plugins.find(p => p.id === id)?.name} disabled` });
    }
    setPlugins(getAllPlugins());
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h4 className="mb-3">Plugin Marketplace</h4>
      {message && <Alert variant={message.type} dismissible onClose={() => setMessage('')}>{message.text}</Alert>}
      <Row>
        {plugins.map(plugin => (
          <Col md={6} key={plugin.id} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title>{plugin.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">v{plugin.version} | {plugin.type}</Card.Subtitle>
                    <Card.Text>{plugin.description}</Card.Text>
                    <small className="text-muted">Author: {plugin.author}</small>
                  </div>
                  <Form.Check
                    type="switch"
                    label={plugin.enabled ? 'Enabled' : 'Disabled'}
                    checked={plugin.enabled}
                    onChange={(e) => togglePlugin(plugin.id, e.target.checked)}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
PluginMarketplace.displayName = 'PluginMarketplace';
