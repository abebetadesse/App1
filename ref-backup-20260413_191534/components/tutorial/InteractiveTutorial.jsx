import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
export default function InteractiveTutorial({ onComplete }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const seen = localStorage.getItem('tutorial_seen'); if (!seen) setShow(true); }, []);
  const handleClose = () => { localStorage.setItem('tutorial_seen', 'true'); setShow(false); if (onComplete) onComplete(); };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Welcome to Tham AI!</Modal.Title></Modal.Header>
      <Modal.Body><p>Here's a quick tour:</p><ul><li>Use the sidebar to navigate</li><li>Try voice commands (microphone button)</li><li>Search for professionals with advanced filters</li><li>Track your stats on the dashboard</li></ul></Modal.Body>
      <Modal.Footer><Button variant="primary" onClick={handleClose}>Got it!</Button></Modal.Footer>
    </Modal>
  );
}
