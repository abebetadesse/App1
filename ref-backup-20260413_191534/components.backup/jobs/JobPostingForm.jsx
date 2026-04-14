import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { TaxonomySelector } from '../taxonomy/TaxonomySelector';

export const JobPostingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', visibility: 'public', category: '', subcategory: '', skill: '',
    screeningQuestions: [{ question: '', required: true }],
    minSuccessScore: '', allowedCountries: '', invitedFreelancers: ''
  });
  const [message, setMessage] = useState('');

  const addQuestion = () => setFormData({ ...formData, screeningQuestions: [...formData.screeningQuestions, { question: '', required: true }] });
  const removeQuestion = (idx) => setFormData({ ...formData, screeningQuestions: formData.screeningQuestions.filter((_, i) => i !== idx) });
  const updateQuestion = (idx, field, val) => {
    const updated = [...formData.screeningQuestions];
    updated[idx][field] = val;
    setFormData({ ...formData, screeningQuestions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Job posted successfully!' });
        setTimeout(() => onSubmit && onSubmit(), 2000);
      } else {
        const err = await res.json();
        setMessage({ type: 'danger', text: err.error || 'Failed to post job' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>Post a New Job</h4>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group><Form.Label>Title</Form.Label><Form.Control value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></Form.Group>
          <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></Form.Group>
          <Row>
            <Col><Form.Label>Category</Form.Label><TaxonomySelector level={1} onChange={val => setFormData({...formData, category: val})} /></Col>
            <Col><Form.Label>Subcategory</Form.Label><TaxonomySelector level={2} parent={formData.category} onChange={val => setFormData({...formData, subcategory: val})} /></Col>
            <Col><Form.Label>Skill</Form.Label><TaxonomySelector level={3} parent={formData.subcategory} onChange={val => setFormData({...formData, skill: val})} /></Col>
          </Row>
          <Row>
            <Col><Form.Label>Budget ($)</Form.Label><Form.Control type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required /></Col>
            <Col><Form.Label>Visibility</Form.Label><Form.Select value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})}><option value="public">Public</option><option value="platform">Platform Only</option><option value="invite">Invite Only</option></Form.Select></Col>
          </Row>
          <Row>
            <Col><Form.Label>Min Success Score</Form.Label><Form.Control type="number" value={formData.minSuccessScore} onChange={e => setFormData({...formData, minSuccessScore: e.target.value})} /></Col>
            <Col><Form.Label>Allowed Countries (comma)</Form.Label><Form.Control value={formData.allowedCountries} onChange={e => setFormData({...formData, allowedCountries: e.target.value})} /></Col>
            <Col><Form.Label>Invited Freelancers (IDs)</Form.Label><Form.Control value={formData.invitedFreelancers} onChange={e => setFormData({...formData, invitedFreelancers: e.target.value})} /></Col>
          </Row>
          <div><strong>Screening Questions</strong> <Button size="sm" onClick={addQuestion}>+ Add</Button></div>
          {formData.screeningQuestions.map((q, idx) => (
            <div key={idx} className="d-flex gap-2 mt-2">
              <Form.Control placeholder="Question" value={q.question} onChange={e => updateQuestion(idx, 'question', e.target.value)} />
              <Form.Check label="Required" checked={q.required} onChange={e => updateQuestion(idx, 'required', e.target.checked)} />
              <Button variant="danger" size="sm" onClick={() => removeQuestion(idx)}>Remove</Button>
            </div>
          ))}
          <Button type="submit" className="mt-3 w-100">Post Job</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
