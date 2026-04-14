import api from './api';

export const getProfile = async (profileId) => {
  const response = await api.get(`/profile-owners/${profileId}`);
  return response.data;
};

export const updateProfile = async (profileId, data) => {
  const response = await api.put(`/profile-owners/${profileId}`, data);
  return response.data;
};

export const uploadPortfolio = async (profileId, formData) => {
  const response = await api.post(`/profile-owners/${profileId}/portfolio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
