import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, submitProposal } from '../../services/jobs';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [proposal, setProposal] = useState({ coverLetter: '', bidAmount: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getJobById(id).then(setJob).catch(console.error);
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await submitProposal(id, proposal);
      toast.success('Proposal submitted successfully!');
      navigate('/profile-owner/proposals');
    } catch (err) {
      toast.error('Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-600 mb-6">{job.description}</p>
      <div className="flex gap-4 mb-8">
        <span className="bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">Budget: ${job.budgetMin} - ${job.budgetMax}</span>
      </div>

      {user?.role === 'profile_owner' && (
        <form onSubmit={handleApply} className="space-y-4">
          <textarea value={proposal.coverLetter} onChange={e => setProposal({...proposal, coverLetter: e.target.value})}
            className="w-full p-3 border rounded-xl" rows="5" placeholder="Write your cover letter..." required />
          <input type="number" value={proposal.bidAmount} onChange={e => setProposal({...proposal, bidAmount: e.target.value})}
            className="w-full p-3 border rounded-xl" placeholder="Your bid amount ($)" required />
          <button type="submit" disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
            {loading ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
      )}
    </div>
  );
};
export default JobDetails;
