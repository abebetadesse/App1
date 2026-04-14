import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function BadgeDisplay() {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  useEffect(() => {
    const allBadges = localStorage.getItem('admin_badges');
    if (allBadges) setBadges(JSON.parse(allBadges));
    const earned = localStorage.getItem('user_badges');
    if (earned) setUserBadges(JSON.parse(earned));
    else setUserBadges([1]); // earned first badge
  }, []);
  return (
    <Card>
      <Card.Header>🏅 Your Badges</Card.Header>
      <Card.Body>
        <Row>
          {badges.map(badge => {
            const earned = userBadges.includes(badge.id);
            return (
              <Col key={badge.id} className="text-center mb-3">
                <OverlayTrigger placement="top" overlay={<Tooltip>{badge.criteria}</Tooltip>}>
                  <div style={{ opacity: earned ? 1 : 0.3, cursor: 'help' }}>
                    <div style={{ fontSize: '3rem' }}>{badge.icon}</div>
                    <div>{badge.name}</div>
                    {earned && <small className="text-success">✓ Earned</small>}
                  </div>
                </OverlayTrigger>
              </Col>
            );
          })}
        </Row>
      </Card.Body>
    </Card>
  );
}
