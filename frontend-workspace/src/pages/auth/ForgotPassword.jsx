import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ForgotPassword = forwardRef((props, ref) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authAPI.forgotPassword({ email });
      setMessage('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Reset Password</h2>
                <p className="text-muted">Enter your email to receive reset instructions.</p>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </Form>
              <div className="text-center"><Link to="/login">Back to Login</Link></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
ForgotPassword.displayName = 'ForgotPassword';
