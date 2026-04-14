import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import StarRating from './StarRating';

export default function RatingModal({ show, onHide, userId, jobId, onSuccess }) {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (score === 0) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ toUserId: userId, jobId, score, review })
      });
      if (res.ok) {
        onSuccess && onSuccess();
        onHide();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit rating');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>Rate this Freelancer</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="text-center mb-3"><StarRating onChange={setScore} /></div>
        <Form.Group><Form.Label>Review (optional)</Form.Label><Form.Control as="textarea" rows={3} value={review} onChange={e => setReview(e.target.value)} /></Form.Group>
      </Modal.Body>
      <Modal.Footer><Button onClick={onHide}>Cancel</Button><Button onClick={handleSubmit} disabled={loading}>Submit Rating</Button></Modal.Footer>
    </Modal>
  );
}
