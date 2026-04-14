import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function ContactFormPro({ onSubmit, loading }) {
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!data.name) err.name = 'Name required';
    if (!data.email) err.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) err.email = 'Invalid email';
    if (!data.message) err.message = 'Message required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control value={data.name} onChange={e => setData({...data, name: e.target.value})} isInvalid={!!errors.name} />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} isInvalid={!!errors.email} />
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={3} value={data.message} onChange={e => setData({...data, message: e.target.value})} isInvalid={!!errors.message} />
        <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
    </Form>
  );
}
