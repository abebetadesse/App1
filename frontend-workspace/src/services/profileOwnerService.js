/* eslint-disable no-unused-vars */
import api from './api';

export const profileOwnerService = {
  async getProfile() {
    const response = await api.get('/api/profile-owners/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/api/profile-owners/me', profileData);
    return response.data;
  },

  async uploadDocuments(formData) {
    const response = await api.post('/api/profile-owners/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getCourses() {
    const response = await api.get('/api/profile-owners/me/courses');
    return response.data;
  },

  async syncMoodle() {
    const response = await api.post('/api/moodle/sync');
    return response.data;
  },

  async updateAvailability(availability) {
    const response = await api.put('/api/profile-owners/me/availability', { availability });
    return response.data;
  }
};