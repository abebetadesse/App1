import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { getAllPlugins, togglePlugin, initPlugins } from '../../plugins/pluginManager';

const PluginMarketplace = forwardRef((props, ref) {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    initPlugins();
    setPlugins(getAllPlugins());
  }, []);

  const handleToggle = (pluginId, enabled) => {
    togglePlugin(pluginId, enabled);
    setPlugins(getAllPlugins());
  };

  return (
    <Card>
      <Card.Header>🔌 Plugin Marketplace – Free Plugins</Card.Header>
      <Card.Body>
        <div className="row">
          {plugins.map(plugin => (
            <div key={plugin.id} className="col-md-6 mb-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>{plugin.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">v{plugin.version} by {plugin.author}</Card.Subtitle>
                      <Card.Text>{plugin.description}</Card.Text>
                    </div>
                    <Form.Check
                      type="switch"
                      label={plugin.enabled ? 'Enabled' : 'Disabled'}
                      checked={plugin.enabled}
                      onChange={(e) => handleToggle(plugin.id, e.target.checked)}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
PluginMarketplace.displayName = 'PluginMarketplace';
