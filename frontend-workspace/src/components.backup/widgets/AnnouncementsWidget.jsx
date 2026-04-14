import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const AnnouncementsWidget = forwardRef((props, ref) {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    adminAPI.getAnnouncements().then(res => setAnnouncements(res.data)).catch(() => {});
  }, []);
  return (
    <Card className="mb-4">
      <Card.Header>📢 Announcements</Card.Header>
      <Card.Body>
        {announcements.map(a => (
          <Alert key={a.id} variant={a.type} className="mb-2">
            <strong>{a.title}</strong><br />{a.content}
          </Alert>
        ))}
      </Card.Body>
    </Card>
  );
}
AnnouncementsWidget.displayName = 'AnnouncementsWidget';
