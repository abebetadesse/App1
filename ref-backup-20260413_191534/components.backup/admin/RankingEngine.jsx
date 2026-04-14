import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export default function RankingEngine() {
  const [weights, setWeights] = useState({ courseCompletion: 40, rating: 30, experience: 20, profile: 10 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ranking_weights');
    if (saved) setWeights(JSON.parse(saved));
  }, []);

  const saveWeights = () => {
    localStorage.setItem('ranking_weights', JSON.stringify(weights));
    setMessage({ type: 'success', text: 'Ranking formula updated' });
    setTimeout(() => setMessage(''), 3000);
  };

  const updateWeight = (key, value) => {
    const newWeights = { ...weights, [key]: parseInt(value) };
    setWeights(newWeights);
  };

  return (
    <Card>
      <Card.Header>⚙️ Dynamic Ranking Engine</Card.Header>
      <Card.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <p>Adjust weights for the Trust Score calculation:</p>
        <Row>
          <Col md={3}><Form.Group><Form.Label>Course Completion (%)</Form.Label><Form.Control type="number" value={weights.courseCompletion} onChange={e => updateWeight('courseCompletion', e.target.value)} /></Form.Group></Col>
          <Col md={3}><Form.Group><Form.Label>Client Rating (%)</Form.Label><Form.Control type="number" value={weights.rating} onChange={e => updateWeight('rating', e.target.value)} /></Form.Group></Col>
          <Col md={3}><Form.Group><Form.Label>Experience (%)</Form.Label><Form.Control type="number" value={weights.experience} onChange={e => updateWeight('experience', e.target.value)} /></Form.Group></Col>
          <Col md={3}><Form.Group><Form.Label>Profile Completion (%)</Form.Label><Form.Control type="number" value={weights.profile} onChange={e => updateWeight('profile', e.target.value)} /></Form.Group></Col>
        </Row>
        <Button className="mt-3" onClick={saveWeights}>Save Formula</Button>
      </Card.Body>
    </Card>
  );
}
