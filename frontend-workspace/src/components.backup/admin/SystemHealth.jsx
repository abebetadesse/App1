import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const SystemHealth = forwardRef((props, ref) {
  const [health, setHealth] = useState({ api: 'unknown', db: 'unknown', redis: 'unknown' });
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setHealth({ api: 'offline', db: 'offline', redis: 'offline' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card>
      <Card.Header>🖥️ System Health</Card.Header>
      <Card.Body>
        <Row><Col>API:<Badge bg={health.api === 'healthy' ? 'success' : 'danger'}>{health.api || 'unknown'}</Badge></Col>
        <Col>Database:<Badge bg={health.db === 'healthy' ? 'success' : 'danger'}>{health.db || 'unknown'}</Badge></Col>
        <Col>Redis:<Badge bg={health.redis === 'healthy' ? 'success' : 'danger'}>{health.redis || 'unknown'}</Badge></Col></Row>
      </Card.Body>
    </Card>
  );
}
SystemHealth.displayName = 'SystemHealth';
