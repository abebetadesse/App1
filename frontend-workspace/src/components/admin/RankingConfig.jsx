import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const RankingConfig = forwardRef((props, ref) {
  const [config, setConfig] = useState({ courseCompletionWeight: 40, ratingWeight: 30, experienceWeight: 20, profileWeight: 10 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ranking_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const saveConfig = () => {
    localStorage.setItem('ranking_config', JSON.stringify(config));
    setMessage({ type: 'success', text: 'Ranking configuration saved' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Card>
      <Card.Header>Ranking Criteria Configuration</Card.Header>
      <Card.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form>
          <Form.Group><Form.Label>Course Completion Weight (%)</Form.Label><Form.Control type="number" value={config.courseCompletionWeight} onChange={e => setConfig({...config, courseCompletionWeight: parseInt(e.target.value)})} /></Form.Group>
          <Form.Group><Form.Label>Client Rating Weight (%)</Form.Label><Form.Control type="number" value={config.ratingWeight} onChange={e => setConfig({...config, ratingWeight: parseInt(e.target.value)})} /></Form.Group>
          <Form.Group><Form.Label>Experience Weight (%)</Form.Label><Form.Control type="number" value={config.experienceWeight} onChange={e => setConfig({...config, experienceWeight: parseInt(e.target.value)})} /></Form.Group>
          <Form.Group><Form.Label>Profile Completion Weight (%)</Form.Label><Form.Control type="number" value={config.profileWeight} onChange={e => setConfig({...config, profileWeight: parseInt(e.target.value)})} /></Form.Group>
          <Button className="mt-3" onClick={saveConfig}>Save Configuration</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
RankingConfig.displayName = 'RankingConfig';
