import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name });
    setMessage('Profile updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Card className="mt-4">
      <Card.Header>👤 Profile Settings</Card.Header>
      <Card.Body>
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={e => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={user?.email || ''} disabled />
          </Form.Group>
          <Button type="submit">Save Changes</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
