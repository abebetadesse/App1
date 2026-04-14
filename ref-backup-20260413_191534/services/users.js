/* eslint-disable no-unused-vars */
import api from './api';

export const usersApi = {
  // Get all users (admin only)
  getUsers: async (filters = {}) => {
    const response = await api.get('/api/admin/users', { params: filters });
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, updates) => {
    const response = await api.put(`/api/admin/users/${userId}`, updates);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/api/admin/analytics/users');
    return response.data;
  }
};

export default usersApi;