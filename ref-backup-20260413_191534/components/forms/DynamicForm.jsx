import React, { useState, Suspense, lazy } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { loadPluginComponent, pluginRegistry } from '../../plugins/PluginLoader';

export default function DynamicForm({ show, onHide, formType, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const FormComponent = loadPluginComponent(formType);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit?.(data);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{pluginRegistry[formType]?.name || 'Dynamic Form'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {FormComponent ? (
          <Suspense fallback={<div className="text-center p-4"><Spinner animation="border" /></div>}>
            <FormComponent onSubmit={handleSubmit} loading={loading} />
          </Suspense>
        ) : (
          <Alert variant="warning">Form plugin not available</Alert>
        )}
      </Modal.Body>
    </Modal>
  );
}
