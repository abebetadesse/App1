import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import StarRating from './StarRating';

export const ClientRatingModal = ({ show, onHide, proposalId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ proposalId, rating, review })
      });
      if (res.ok) {
        onSubmit && onSubmit();
        onHide();
      } else {
        setError('Failed to submit rating');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Rate this Project</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="text-center mb-3"><StarRating onChange={setRating} /></div>
        <Form.Group><Form.Label>Review (optional)</Form.Label><Form.Control as="textarea" rows={3} value={review} onChange={e => setReview(e.target.value)} /></Form.Group>
      </Modal.Body>
      <Modal.Footer><Button onClick={onHide}>Cancel</Button><Button onClick={handleSubmit} disabled={submitting}>Submit Rating</Button></Modal.Footer>
    </Modal>
  );
};
