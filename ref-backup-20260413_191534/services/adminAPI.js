/* eslint-disable no-unused-vars */
// src/services/adminAPI.js
import api from './api';

const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Analytics
  getConnectionAnalytics: (params) => api.get('/admin/analytics/connections', { params }),
  getRankingAnalytics: () => api.get('/admin/analytics/ranking'),
  
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, data) => api.put(`/admin/users/${userId}/status`, data),
  verifyProfileOwner: (profileOwnerId) => api.put(`/admin/profile-owners/${profileOwnerId}/verify`),
  
  // Ranking Criteria
  getRankingCriteria: () => api.get('/admin/ranking-criteria'),
  createRankingCriteria: (data) => api.post('/admin/ranking-criteria', data),
  updateRankingCriteria: (id, data) => api.put(`/admin/ranking-criteria/${id}`, data),
  deleteRankingCriteria: (id) => api.delete(`/admin/ranking-criteria/${id}`),
  triggerRankingRecalculation: () => api.post('/admin/ranking/recalculate'),
};

export default {adminAPI};