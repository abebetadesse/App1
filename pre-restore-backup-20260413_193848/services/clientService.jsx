import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const clientAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
clientAPI.interceptors.request.use(
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
clientAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const clientService = {
  // Search and Matching Services
  search: {
    /**
     * Search for profile owners with advanced filters
     * @param {Object} filters - Search criteria
     * @returns {Promise}
     */
    searchProfiles: async (filters) => {
      try {
        const response = await clientAPI.post('/search/profiles', { filters });
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
        const response = await clientAPI.get(`/search/best-matches/${queryId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get matches');
      }
    },

    /**
     * Get available search categories
     * @returns {Promise}
     */
    getCategories: async () => {
      try {
        const response = await clientAPI.get('/search/categories');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get categories');
      }
    },

    /**
     * Get available skills for filtering
     * @returns {Promise}
     */
    getSkills: async () => {
      try {
        const response = await clientAPI.get('/search/skills');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get skills');
      }
    },

    /**
     * Save search preferences
     * @param {Object} preferences - Search preferences
     * @returns {Promise}
     */
    saveSearchPreferences: async (preferences) => {
      try {
        const response = await clientAPI.post('/search/preferences', preferences);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to save preferences');
      }
    },
  },

  // Connection Services
  connections: {
    /**
     * Create a new connection with a profile owner
     * @param {Object} connectionData - Connection details
     * @returns {Promise}
     */
    createConnection: async (connectionData) => {
      try {
        const response = await clientAPI.post('/connections', connectionData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create connection');
      }
    },

    /**
     * Get client's connection history
     * @param {Object} options - Pagination and filtering options
     * @returns {Promise}
     */
    getConnections: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.status) params.append('status', options.status);

        const response = await clientAPI.get(`/connections/client?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connections');
      }
    },

    /**
     * Mark a connection as contacted (call made)
     * @param {string} connectionId - Connection ID
     * @returns {Promise}
     */
    markCallMade: async (connectionId) => {
      try {
        const response = await clientAPI.put(`/connections/${connectionId}/call-made`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update connection');
      }
    },

    /**
     * Submit feedback for a connection
     * @param {string} connectionId - Connection ID
     * @param {number} rating - Rating (1-5)
     * @param {string} comment - Optional comment
     * @returns {Promise}
     */
    submitFeedback: async (connectionId, rating, comment = '') => {
      try {
        const response = await clientAPI.put(`/connections/${connectionId}/feedback`, {
          rating,
          comment,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to submit feedback');
      }
    },

    /**
     * Get connection statistics
     * @returns {Promise}
     */
    getConnectionStats: async () => {
      try {
        const response = await clientAPI.get('/connections/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connection stats');
      }
    },
  },

  // Project Management Services
  projects: {
    /**
     * Create a new project
     * @param {Object} projectData - Project details
     * @returns {Promise}
     */
    createProject: async (projectData) => {
      try {
        const response = await clientAPI.post('/projects', projectData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create project');
      }
    },

    /**
     * Get client's projects
     * @param {Object} options - Filtering and pagination options
     * @returns {Promise}
     */
    getProjects: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await clientAPI.get(`/projects?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get projects');
      }
    },

    /**
     * Get project details
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getProjectDetails: async (projectId) => {
      try {
        const response = await clientAPI.get(`/projects/${projectId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project details');
      }
    },

    /**
     * Update project status
     * @param {string} projectId - Project ID
     * @param {string} status - New status
     * @returns {Promise}
     */
    updateProjectStatus: async (projectId, status) => {
      try {
        const response = await clientAPI.put(`/projects/${projectId}/status`, { status });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update project status');
      }
    },

    /**
     * Add milestone to project
     * @param {string} projectId - Project ID
     * @param {Object} milestoneData - Milestone details
     * @returns {Promise}
     */
    addMilestone: async (projectId, milestoneData) => {
      try {
        const response = await clientAPI.post(`/projects/${projectId}/milestones`, milestoneData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add milestone');
      }
    },

    /**
     * Update project progress
     * @param {string} projectId - Project ID
     * @param {number} progress - Progress percentage (0-100)
     * @returns {Promise}
     */
    updateProgress: async (projectId, progress) => {
      try {
        const response = await clientAPI.put(`/projects/${projectId}/progress`, { progress });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update progress');
      }
    },

    /**
     * Upload project document
     * @param {string} projectId - Project ID
     * @param {FormData} formData - Document data
     * @returns {Promise}
     */
    uploadDocument: async (projectId, formData) => {
      try {
        const response = await clientAPI.post(`/projects/${projectId}/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload document');
      }
    },
  },

  // Profile Owner Services
  profileOwners: {
    /**
     * Get profile owner details
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    getProfileDetails: async (profileOwnerId) => {
      try {
        const response = await clientAPI.get(`/profile-owners/${profileOwnerId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get profile details');
      }
    },

    /**
     * Get profile owner's portfolio
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    getPortfolio: async (profileOwnerId) => {
      try {
        const response = await clientAPI.get(`/profile-owners/${profileOwnerId}/portfolio`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get portfolio');
      }
    },

    /**
     * Get profile owner's reviews and ratings
     * @param {string} profileOwnerId - Profile owner ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getReviews: async (profileOwnerId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await clientAPI.get(`/profile-owners/${profileOwnerId}/reviews?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get reviews');
      }
    },

    /**
     * Save profile owner to favorites
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    addToFavorites: async (profileOwnerId) => {
      try {
        const response = await clientAPI.post('/favorites', { profileOwnerId });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add to favorites');
      }
    },

    /**
     * Remove profile owner from favorites
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    removeFromFavorites: async (profileOwnerId) => {
      try {
        const response = await clientAPI.delete(`/favorites/${profileOwnerId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to remove from favorites');
      }
    },

    /**
     * Get favorite profile owners
     * @returns {Promise}
     */
    getFavorites: async () => {
      try {
        const response = await clientAPI.get('/favorites');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get favorites');
      }
    },
  },

  // Messaging and Communication Services
  messaging: {
    /**
     * Send message to profile owner
     * @param {string} profileOwnerId - Profile owner ID
     * @param {string} message - Message content
     * @returns {Promise}
     */
    sendMessage: async (profileOwnerId, message) => {
      try {
        const response = await clientAPI.post('/messages', {
          recipientId: profileOwnerId,
          message,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to send message');
      }
    },

    /**
     * Get conversation with profile owner
     * @param {string} profileOwnerId - Profile owner ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getConversation: async (profileOwnerId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await clientAPI.get(`/messages/conversation/${profileOwnerId}?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get conversation');
      }
    },

    /**
     * Get all conversations
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getConversations: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await clientAPI.get(`/messages/conversations?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get conversations');
      }
    },

    /**
     * Mark messages as read
     * @param {string} conversationId - Conversation ID
     * @returns {Promise}
     */
    markAsRead: async (conversationId) => {
      try {
        const response = await clientAPI.put(`/messages/conversation/${conversationId}/read`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to mark as read');
      }
    },
  },

  // Client Profile Services
  profile: {
    /**
     * Get client profile
     * @returns {Promise}
     */
    getProfile: async () => {
      try {
        const response = await clientAPI.get('/client/profile');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get client profile');
      }
    },

    /**
     * Update client profile
     * @param {Object} profileData - Updated profile data
     * @returns {Promise}
     */
    updateProfile: async (profileData) => {
      try {
        const response = await clientAPI.put('/client/profile', profileData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update profile');
      }
    },

    /**
     * Update notification preferences
     * @param {Object} preferences - Notification preferences
     * @returns {Promise}
     */
    updateNotificationPreferences: async (preferences) => {
      try {
        const response = await clientAPI.put('/client/notifications', preferences);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update preferences');
      }
    },

    /**
     * Verify phone number
     * @param {string} phoneNumber - Phone number to verify
     * @returns {Promise}
     */
    verifyPhone: async (phoneNumber) => {
      try {
        const response = await clientAPI.post('/client/verify-phone', { phoneNumber });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to verify phone');
      }
    },

    /**
     * Confirm phone verification code
     * @param {string} code - Verification code
     * @returns {Promise}
     */
    confirmPhoneVerification: async (code) => {
      try {
        const response = await clientAPI.post('/client/confirm-phone', { code });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to confirm verification');
      }
    },
  },

  // Analytics and Reporting Services
  analytics: {
    /**
     * Get client dashboard analytics
     * @returns {Promise}
     */
    getDashboardAnalytics: async () => {
      try {
        const response = await clientAPI.get('/analytics/dashboard');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get analytics');
      }
    },

    /**
     * Get search history
     * @param {Object} options - Date range and pagination
     * @returns {Promise}
     */
    getSearchHistory: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await clientAPI.get(`/analytics/search-history?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get search history');
      }
    },

    /**
     * Get connection analytics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getConnectionAnalytics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await clientAPI.get(`/analytics/connections?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connection analytics');
      }
    },
  },

  // Utility Methods
  utils: {
    /**
     * Upload file (documents, images, etc.)
     * @param {File} file - File to upload
     * @param {string} type - File type (document, image, etc.)
     * @returns {Promise}
     */
    uploadFile: async (file, type = 'document') => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await clientAPI.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload file');
      }
    },

    /**
     * Get platform statistics
     * @returns {Promise}
     */
    getPlatformStats: async () => {
      try {
        const response = await clientAPI.get('/platform/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get platform stats');
      }
    },

    /**
     * Report an issue or problem
     * @param {Object} reportData - Report details
     * @returns {Promise}
     */
    reportIssue: async (reportData) => {
      try {
        const response = await clientAPI.post('/report-issue', reportData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to report issue');
      }
    },
  },
};

// Export both default and named exports
export default clientService;
export const {
  search,
  connections,
  projects,
  profileOwners,
  messaging,
  profile,
  analytics,
  utils,
} = clientService;

// Hook for using client service in React components
export const useClientService = () => {
  return clientService;
};

export {clientService};