import React, { useState, useEffect } from 'react';
import { Card, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const BadgesWidget = forwardRef((props, ref) {
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    adminAPI.getBadges().then(res => setBadges(res.data.slice(0, 4))).catch(() => {});
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>🏅 Your Badges</Card.Header>
      <Card.Body>
        <Row>{badges.map(b => (<Col key={b.id} className="text-center"><OverlayTrigger overlay={<Tooltip>{b.criteria}</Tooltip>}><div style={{ fontSize: '2rem' }}>{b.icon}</div></OverlayTrigger><small>{b.name}</small></Col>))}</Row>
      </Card.Body>
    </Card>
  );
}
BadgesWidget.displayName = 'BadgesWidget';
