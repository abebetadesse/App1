import api from './api';

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const getJobs = async (filters = {}) => {
  const response = await api.get('/jobs', { params: filters });
  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export const submitProposal = async (jobId, proposalData) => {
  const response = await api.post(`/jobs/${jobId}/proposals`, proposalData);
  return response.data;
};

export const getMyProposals = async () => {
  const response = await api.get('/proposals/my');
  return response.data;
};
