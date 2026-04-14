import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';

const Login = forwardRef((props, ref) {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {}
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Login</h2>
          {(localError || error) && <Alert variant="danger">{localError || error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Login'}
            </button>
          </form>
          <div className="text-center mt-3"><Link to="/forgot-password">Forgot Password?</Link></div>
          <p className="mt-3 text-center text-muted">Demo: admin@tham.com / admin123</p>
          <p className="text-center"><Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
Login.displayName = 'Login';
