import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { clientAPI } from '../../services/api';

export default function RecommendedProfilesWidget() {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    clientAPI.getRecommendations().then(res => setProfiles(res.data.slice(0, 3))).catch(() => {});
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>⭐ Recommended for You</Card.Header>
      <Card.Body>
        <Row>{profiles.map(p => (<Col key={p.id} md={4}><Card><Card.Body><h6>{p.name}</h6><Button size="sm">View</Button></Card.Body></Card></Col>))}</Row>
      </Card.Body>
    </Card>
  );
}
