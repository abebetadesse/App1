import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';

const Notifications = forwardRef((props, ref) {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } })
      .then(res => res.json())
      .then(setNotifs);
  }, []);
  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  return (
    <Container className="py-4">
      <h1>Notifications</h1>
      <ListGroup>
        {notifs.map(n => (
          <ListGroup.Item key={n.id} className={!n.read ? 'bg-light' : ''}>
            <div className="d-flex justify-content-between">
              <div><strong>{n.title}</strong><br/>{n.content}</div>
              {!n.read && <Button size="sm" variant="outline-primary" onClick={() => markRead(n.id)}>Mark read</Button>}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
Notifications.displayName = 'Notifications';
