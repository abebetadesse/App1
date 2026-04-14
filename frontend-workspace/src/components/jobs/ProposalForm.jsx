import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { scanMessageForOffPlatform, checkProposalRateLimit } from '../../utils/fraudDetection';

export const ProposalForm = ({ job, show, onHide, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState({});
  const [boosted, setBoosted] = useState(false);
  const [bidAmount, setBidAmount] = useState(job?.budget || 0);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!checkProposalRateLimit()) {
      setMessage({ type: 'danger', text: 'Too many proposals. Please wait.' });
      return;
    }
    if (scanMessageForOffPlatform(coverLetter)) {
      setMessage({ type: 'danger', text: 'Suspicious content detected. Please remove contact info.' });
      return;
    }
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ jobId: job.id, coverLetter, answers, boosted, bidAmount })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Proposal submitted!' });
        setTimeout(() => { onSubmit(); onHide(); }, 1500);
      } else {
        setMessage({ type: 'danger', text: 'Failed to submit' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  if (!job) return null;
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton><Modal.Title>Submit Proposal for {job.title}</Modal.Title></Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form>
          <Form.Group><Form.Label>Cover Letter</Form.Label><Form.Control as="textarea" rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required /></Form.Group>
          {job.screeningQuestions?.map((q, idx) => (
            <Form.Group key={idx}><Form.Label>{q.question}</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setAnswers({...answers, [idx]: e.target.value})} required={q.required} /></Form.Group>
          ))}
          <Form.Group><Form.Label>Bid Amount ($)</Form.Label><Form.Control type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} /></Form.Group>
          <Form.Check type="checkbox" label="Boost proposal (uses 5 Connects)" checked={boosted} onChange={e => setBoosted(e.target.checked)} />
        </Form>
      </Modal.Body>
      <Modal.Footer><Button variant="secondary" onClick={onHide}>Cancel</Button><Button onClick={handleSubmit}>Submit</Button></Modal.Footer>
    </Modal>
  );
};
