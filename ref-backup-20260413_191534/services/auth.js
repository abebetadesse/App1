/* eslint-disable no-unused-vars */
import api from './api';

export const authApi = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const response = await api.put(`/api/auth/profile/${userId}`, updates);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/api/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};
export default authApi;