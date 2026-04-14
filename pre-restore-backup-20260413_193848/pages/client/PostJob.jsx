import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobPostingForm from '../../components/forms/JobPostingForm';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const handleSuccess = (job) => {
    navigate(`/client/jobs/${job.id}`);
  };

  if (!user || user.role !== 'client') {
    return <div>Access denied. Clients only.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      <JobPostingForm onSuccess={handleSuccess} onError={setError} />
    </div>
  );
};

export default PostJob;
