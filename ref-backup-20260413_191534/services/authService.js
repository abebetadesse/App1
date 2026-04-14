/* eslint-disable no-unused-vars */
import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async logout() {
    await api.post('/api/auth/logout');
  },

  async refreshToken() {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  }
};