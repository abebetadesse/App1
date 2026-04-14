import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/jobs';
import { getTaxonomyTree } from '../../services/taxonomy';
import { motion } from 'framer-motion';

const PostJob = () => {
  const [form, setForm] = useState({ title: '', description: '', budgetMin: '', budgetMax: '', categoryPath: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTaxonomyTree().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob(form);
      navigate('/client/dashboard');
    } catch (err) {
      alert('Failed to post job: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          className="w-full px-4 py-3 border rounded-xl" placeholder="Job Title" required />
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
          rows="6" className="w-full px-4 py-3 border rounded-xl" placeholder="Description" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={form.budgetMin} onChange={e => setForm({...form, budgetMin: e.target.value})}
            className="px-4 py-3 border rounded-xl" placeholder="Min Budget" />
          <input type="number" value={form.budgetMax} onChange={e => setForm({...form, budgetMax: e.target.value})}
            className="px-4 py-3 border rounded-xl" placeholder="Max Budget" />
        </div>
        <select value={form.categoryPath} onChange={e => setForm({...form, categoryPath: e.target.value})}
          className="w-full px-4 py-3 border rounded-xl" required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </motion.div>
  );
};
export default PostJob;
