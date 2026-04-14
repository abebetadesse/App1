import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';

const Register = forwardRef((props, ref) {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name || !email || !password) {
      setLocalError('Please fill all fields');
      return;
    }
    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err) {}
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Register</h2>
          {(localError || error) && <Alert variant="danger">{localError || error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><label>Full Name</label><input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="mb-3"><label>Email</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="mb-3"><label>Password</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <div className="mb-3"><label>Role</label><select className="form-select" value={role} onChange={e => setRole(e.target.value)}><option value="client">Client</option><option value="profile_owner">Profile Owner</option></select></div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Register'}</button>
          </form>
          <p className="mt-3 text-center"><Link to="/login">Already have an account? Login</Link></p>
        </div>
      </div>
    </div>
  );
}
Register.displayName = 'Register';
