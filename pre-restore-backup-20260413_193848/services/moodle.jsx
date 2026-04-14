import React from "react";
/* eslint-disable no-unused-vars */
import api from './api';

export const moodleApi = {
  // Link Moodle account
  linkAccount: async (userId, moodleCredentials) => {
    const response = await api.post('/api/moodle/link-account', {
      userId,
      ...moodleCredentials
    });
    return response.data;
  },

  // Sync user progress
  syncUserProgress: async (userId) => {
    const response = await api.post(`/api/moodle/sync-user/${userId}`);
    return response.data;
  },

  // Get user courses
  getUserCourses: async (userId) => {
    const response = await api.get(`/api/moodle/user-progress/${userId}`);
    return response.data;
  },

  // Update ranking
  updateRanking: async (userId) => {
    const response = await api.post(`/api/moodle/update-ranking/${userId}`);
    return response.data;
  },

  // Admin methods
  getCourses: async () => {
    const response = await api.get('/api/admin/moodle/courses');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/admin/moodle/categories');
    return response.data;
  },

  syncAllCourses: async () => {
    const response = await api.post('/api/admin/moodle/sync-courses');
    return response.data;
  },

  recalculateAllRankings: async () => {
    const response = await api.post('/api/admin/moodle/recalculate-rankings');
    return response.data;
  },

  getSyncLogs: async () => {
    const response = await api.get('/api/admin/moodle/sync-logs');
    return response.data;
  },

  // Get course progress for user
  getCourseProgress: async (userId) => {
    const response = await api.get(`/api/moodle/course-progress/${userId}`);
    return response.data;
  }
};
export default moodleApi;