import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import DynamicForm from './DynamicForm';

export default function DynamicFormDemo() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('contactForm');
  const [result, setResult] = useState(null);

  const handleFormSubmit = (data) => {
    setResult({ success: true, data, timestamp: new Date().toISOString() });
    setTimeout(() => setResult(null), 5000);
  };

  const openForm = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  return (
    <Card>
      <Card.Header>📝 Dynamic Forms – Powered by Plugins</Card.Header>
      <Card.Body>
        <p>Click any button below to load a dynamic form plugin:</p>
        <div className="d-flex gap-3 mb-4">
          <Button variant="primary" onClick={() => openForm('contactForm')}>Contact Form Pro</Button>
          <Button variant="success" onClick={() => openForm('surveyForm')}>Feedback Survey</Button>
        </div>
        {result && <Alert variant="success">Form submitted! Check console for data.</Alert>}
        <DynamicForm show={showForm} onHide={() => setShowForm(false)} formType={formType} onSubmit={handleFormSubmit} />
      </Card.Body>
    </Card>
  );
}
