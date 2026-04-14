import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const SystemTelemetry = forwardRef((props, ref) {
  const [metrics, setMetrics] = useState({ users: 1245, connections: 892, moodleSyncs: 456, avgResponse: '2.4h' });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({ ...prev, users: prev.users + Math.floor(Math.random() * 10) }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <Card.Header>📊 System Telemetry</Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}><div className="text-center"><h3>{metrics.users}</h3><small>Total Users</small></div></Col>
          <Col md={3}><div className="text-center"><h3>{metrics.connections}</h3><small>Connections</small></div></Col>
          <Col md={3}><div className="text-center"><h3>{metrics.moodleSyncs}</h3><small>Moodle Syncs</small></div></Col>
          <Col md={3}><div className="text-center"><h3>{metrics.avgResponse}</h3><small>Avg Response</small></div></Col>
        </Row>
        <hr />
        <div className="d-flex justify-content-between"><span>API Status:</span><Badge bg="success">Online</Badge></div>
        <div className="d-flex justify-content-between mt-2"><span>Database:</span><Badge bg="success">Connected</Badge></div>
        <div className="d-flex justify-content-between mt-2"><span>Moodle Sync:</span><Badge bg="warning">Syncing</Badge></div>
      </Card.Body>
    </Card>
  );
}
SystemTelemetry.displayName = 'SystemTelemetry';
