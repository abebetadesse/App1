import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import emailjs from 'emailjs-com';

// Initialize EmailJS with public key (free tier – replace with your own)
emailjs.init('YOUR_PUBLIC_KEY');

const ContactEmailForm = forwardRef((props, ref) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send email using EmailJS (free 200 emails/month)
      await emailjs.send('service_id', 'template_id', formData, 'user_id');
      setResult({ type: 'success', text: 'Message sent! We\'ll contact you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setResult({ type: 'danger', text: 'Failed to send. Please try again later.' });
    } finally {
      setLoading(false);
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {result && <Alert variant={result.type}>{result.text}</Alert>}
      <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control name="name" value={formData.name} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Message</Form.Label><Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} required /></Form.Group>
      <Button type="submit" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Send Message'}</Button>
    </Form>
  );
}
ContactEmailForm.displayName = 'ContactEmailForm';
