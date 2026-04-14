import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const StatsSummaryWidget = forwardRef((props, ref) {
  const [stats, setStats] = useState({ profileViews: 0, connections: 0, rating: 0 });
  useEffect(() => {
    setStats({ profileViews: 1245, connections: 89, rating: 4.8 });
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>📊 Your Stats</Card.Header>
      <Card.Body>
        <Row><Col><h5>{stats.profileViews}</h5><small>Profile Views</small></Col><Col><h5>{stats.connections}</h5><small>Connections</small></Col><Col><h5>{stats.rating}</h5><small>Rating</small></Col></Row>
      </Card.Body>
    </Card>
  );
}
StatsSummaryWidget.displayName = 'StatsSummaryWidget';
