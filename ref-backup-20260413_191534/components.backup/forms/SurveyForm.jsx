import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function SurveyForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback, timestamp: new Date().toISOString() });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>How would you rate your experience?</Form.Label>
        <Form.Range min={1} max={10} value={rating} onChange={e => setRating(e.target.value)} />
        <div className="d-flex justify-content-between"><span>Poor</span><span>Excellent ({rating})</span></div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Feedback (optional)</Form.Label>
        <Form.Control as="textarea" rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} />
      </Form.Group>
      <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Survey'}</Button>
    </Form>
  );
}
