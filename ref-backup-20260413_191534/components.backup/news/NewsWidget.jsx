import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';

export default function NewsWidget() {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem('admin_announcements');
    if (saved) setAnnouncements(JSON.parse(saved));
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>📢 Latest Announcements</Card.Header>
      <Card.Body>
        {announcements.length === 0 && <p>No announcements</p>}
        {announcements.map(a => (
          <Alert key={a.id} variant={a.type} className="mb-2">
            <strong>{a.title}</strong><br />{a.content}<br /><small>{new Date(a.date).toLocaleDateString()}</small>
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );
}
