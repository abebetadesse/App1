import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// FIXED: Remove the duplicate const clientAPI declaration
const clientAPI = {
  // Search and Discovery Services
  search: {
    /**
     * Search for profile owners with advanced filters
     * @param {Object} filters - Search criteria
     * @returns {Promise}
     */
    searchProfiles: async (filters = {}) => {
      try {
        const response = await api.post('/search/profiles', { filters });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Search failed');
      }
    },

    /**
     * Get top 10 best matches for a search query
     * @param {string} queryId - Search query ID
     * @returns {Promise}
     */
    getBestMatches: async (queryId) => {
      try {
        const response = await api.get(`/search/best-matches/${queryId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get matches');
      }
    },

    // ... rest of the search methods
  },

  // ... rest of your API methods
};

// Export both default and named exports
export default clientAPI;
export const {
  search,
  // ... other exports
} = clientAPI;

// Hook for using client API in React components
export const useClientAPI = () => {
  return clientAPI;
};