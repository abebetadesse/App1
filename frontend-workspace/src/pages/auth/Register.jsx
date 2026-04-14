import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Create Account</h2>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="name" required value={form.name} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800" placeholder="Full Name" />
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800" placeholder="Email" />
            <input name="password" type="password" required value={form.password} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800" placeholder="Password" />
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800">
              <option value="client">I want to hire</option>
              <option value="profile_owner">I want to work</option>
            </select>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-6 text-center"><Link to="/login" className="text-indigo-600 hover:underline">Already have an account?</Link></p>
        </div>
      </motion.div>
    </div>
  );
};
export default Register;
