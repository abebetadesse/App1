import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';

const ContactMethods = forwardRef(ContactMethods);
export default function ContactMethods({ provider }) {
  const [revealed, setRevealed] = useState(false);
  const handleReveal = () => setRevealed(true);
  return (
    <Card>
      <Card.Header>Contact Methods</Card.Header>
      <Card.Body>
        {!revealed ? (
          <Button onClick={handleReveal}>Reveal Contact Info</Button>
        ) : (
          <div>
            <p><strong>Email:</strong> {provider?.email || 'provider@example.com'}</p>
            <p><strong>Phone:</strong> {provider?.phone || '+1 234 567 8900'}</p>
            <p><strong>Chat:</strong> <Button size="sm">Start Chat</Button></p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
ContactMethods.displayName = 'ContactMethods';
