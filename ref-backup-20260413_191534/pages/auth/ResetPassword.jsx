import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await authAPI.validateResetToken(token);
      } catch (err) {
        setValidToken(false);
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };
    if (token) validateToken();
    else setValidToken(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authAPI.resetPassword(token, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row><Col md={6} className="mx-auto"><Card className="shadow"><Card.Body className="p-4 text-center">
          <h2>Invalid Reset Link</h2>
          <p>The link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
        </Card.Body></Card></Col></Row>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row><Col md={6} lg={4} className="mx-auto"><Card className="shadow"><Card.Body className="p-4">
        <h2 className="text-center mb-4">Reset Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3"><Form.Label>New Password</Form.Label><Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Confirm Password</Form.Label><Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
        </Form>
        <div className="text-center mt-3"><Link to="/login">Back to Login</Link></div>
      </Card.Body></Card></Col></Row>
    </Container>
  );
}
