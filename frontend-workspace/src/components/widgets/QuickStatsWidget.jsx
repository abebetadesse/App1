import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const QuickStatsWidget = forwardRef((props, ref) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    adminAPI.getAnalytics().then(res => setStats(res.data.stats || {})).catch(() => {});
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>⚡ Quick Stats</Card.Header>
      <Card.Body>
        <Row><Col><h5>{stats.users || 0}</h5><small>Users</small></Col><Col><h5>{stats.connections || 0}</h5><small>Connections</small></Col><Col><h5>${stats.revenue || 0}</h5><small>Revenue</small></Col></Row>
      </Card.Body>
    </Card>
  );
}
QuickStatsWidget.displayName = 'QuickStatsWidget';
