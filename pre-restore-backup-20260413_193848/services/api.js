import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  validateResetToken: (token) => api.get(`/auth/validate-reset-token/${token}`),
};

// Profile Owner endpoints
export const profileOwnerAPI = {
  getDashboard: () => api.get('/profile-owner/dashboard'),
  getDocuments: () => api.get('/profile-owner/documents'),
  uploadDocument: (formData) => api.post('/profile-owner/documents', formData),
  deleteDocument: (id) => api.delete(`/profile-owner/documents/${id}`),
  updateAvailability: (data) => api.put('/profile-owner/availability', data),
  updatePricing: (data) => api.put('/profile-owner/pricing', data),
  getMoodleCourses: () => api.get('/profile-owner/moodle-courses'),
  syncMoodle: () => api.post('/profile-owner/moodle-sync'),
};

// Client endpoints
export const clientAPI = {
  search: (filters) => api.post('/client/search', filters),
  getRecommendations: () => api.get('/client/recommendations'),
  connect: (profileId) => api.post(`/client/connect/${profileId}`),
  getConnections: () => api.get('/client/connections'),
  rateProvider: (profileId, rating) => api.post(`/client/rate/${profileId}`, { rating }),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  updateRankingWeights: (weights) => api.put('/admin/ranking-weights', weights),
  getAnnouncements: () => api.get('/admin/announcements'),
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
  getBadges: () => api.get('/admin/badges'),
  createBadge: (data) => api.post('/admin/badges', data),
  deleteBadge: (id) => api.delete(`/admin/badges/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;
