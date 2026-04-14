import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

export const DocumentUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'danger', text: 'Please select a file' });
      return;
    }
    const formData = new FormData();
    formData.append('document', file);
    setUploading(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: formData
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Document uploaded successfully' });
        onUpload && onUpload();
        setFile(null);
      } else {
        setMessage({ type: 'danger', text: 'Upload failed' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form.Group><Form.Label>Upload Document (PDF, Image)</Form.Label><Form.Control type="file" onChange={e => setFile(e.target.files[0])} /></Form.Group>
      <Button className="mt-2" onClick={handleUpload} disabled={uploading}>{uploading ? <Spinner size="sm" /> : 'Upload'}</Button>
    </div>
  );
};
