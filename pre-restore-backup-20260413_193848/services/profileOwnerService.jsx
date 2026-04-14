import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const profileOwnerAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
profileOwnerAPI.interceptors.request.use(
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
profileOwnerAPI.interceptors.response.use(
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

const profileOwnerService = {
  // Profile Management Services
  profile: {
    /**
     * Create or update profile owner profile
     * @param {Object} profileData - Profile data
     * @param {string} step - Current step in multi-step form
     * @returns {Promise}
     */
    updateProfile: async (profileData, step = null) => {
      try {
        const payload = step ? { step, data: profileData } : profileData;
        const response = await profileOwnerAPI.put('/profile-owners/profile', payload);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update profile');
      }
    },

    /**
     * Get profile owner's complete profile
     * @returns {Promise}
     */
    getProfile: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/profile');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get profile');
      }
    },

    /**
     * Get public profile (for clients to view)
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    getPublicProfile: async (profileOwnerId) => {
      try {
        const response = await profileOwnerAPI.get(`/profile-owners/${profileOwnerId}/public`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get public profile');
      }
    },

    /**
     * Update availability status
     * @param {boolean} isAvailable - Availability status
     * @returns {Promise}
     */
    updateAvailability: async (isAvailable) => {
      try {
        const response = await profileOwnerAPI.put('/profile-owners/availability', { isAvailable });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update availability');
      }
    },

    /**
     * Update pricing information
     * @param {Object} pricingData - Pricing data (hourlyRate, dailyRate, etc.)
     * @returns {Promise}
     */
    updatePricing: async (pricingData) => {
      try {
        const response = await profileOwnerAPI.put('/profile-owners/pricing', pricingData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update pricing');
      }
    },

    /**
     * Get profile statistics and completion status
     * @returns {Promise}
     */
    getProfileStats: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get profile stats');
      }
    },
  },

  // Document Management Services
  documents: {
    /**
     * Upload profile documents
     * @param {FormData} formData - Document files
     * @param {string} documentType - Type of document (resume, certificate, portfolio)
     * @returns {Promise}
     */
    uploadDocuments: async (formData, documentType = 'document') => {
      try {
        const response = await profileOwnerAPI.post('/profile-owners/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: { type: documentType },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload documents');
      }
    },

    /**
     * Get all uploaded documents
     * @returns {Promise}
     */
    getDocuments: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/documents');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get documents');
      }
    },

    /**
     * Delete a document
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    deleteDocument: async (documentId) => {
      try {
        const response = await profileOwnerAPI.delete(`/profile-owners/documents/${documentId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete document');
      }
    },

    /**
     * Update document visibility
     * @param {string} documentId - Document ID
     * @param {boolean} isPublic - Visibility status
     * @returns {Promise}
     */
    updateDocumentVisibility: async (documentId, isPublic) => {
      try {
        const response = await profileOwnerAPI.put(`/profile-owners/documents/${documentId}/visibility`, { isPublic });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update document visibility');
      }
    },
  },

  // Moodle Integration Services
  moodle: {
    /**
     * Link Moodle account
     * @param {Object} credentials - Moodle credentials
     * @returns {Promise}
     */
    linkMoodleAccount: async (credentials) => {
      try {
        const response = await profileOwnerAPI.post('/moodle/link-account', credentials);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to link Moodle account');
      }
    },

    /**
     * Get Moodle course progress
     * @returns {Promise}
     */
    getCourseProgress: async () => {
      try {
        const response = await profileOwnerAPI.get('/moodle/courses/progress');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course progress');
      }
    },

    /**
     * Sync courses with Moodle
     * @returns {Promise}
     */
    syncCourses: async () => {
      try {
        const response = await profileOwnerAPI.post('/moodle/sync-courses');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to sync courses');
      }
    },

    /**
     * Get available courses from Moodle
     * @returns {Promise}
     */
    getAvailableCourses: async () => {
      try {
        const response = await profileOwnerAPI.get('/moodle/courses');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get available courses');
      }
    },

    /**
     * Get course categories
     * @returns {Promise}
     */
    getCourseCategories: async () => {
      try {
        const response = await profileOwnerAPI.get('/moodle/categories');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course categories');
      }
    },

    /**
     * Get certificate for completed course
     * @param {string} courseId - Course ID
     * @returns {Promise}
     */
    getCertificate: async (courseId) => {
      try {
        const response = await profileOwnerAPI.get(`/moodle/courses/${courseId}/certificate`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get certificate');
      }
    },
  },

  // Ranking and Performance Services
  ranking: {
    /**
     * Get current ranking and score
     * @returns {Promise}
     */
    getRanking: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/ranking');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get ranking');
      }
    },

    /**
     * Get ranking history
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getRankingHistory: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await profileOwnerAPI.get(`/profile-owners/ranking/history?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get ranking history');
      }
    },

    /**
     * Get ranking criteria details
     * @returns {Promise}
     */
    getRankingCriteria: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/ranking/criteria');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get ranking criteria');
      }
    },

    /**
     * Request ranking recalculation
     * @returns {Promise}
     */
    requestRankingRecalculation: async () => {
      try {
        const response = await profileOwnerAPI.post('/profile-owners/ranking/recalculate');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to recalculate ranking');
      }
    },
  },

  // Connection Management Services
  connections: {
    /**
     * Get profile owner's connections
     * @param {Object} options - Filtering and pagination options
     * @returns {Promise}
     */
    getConnections: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await profileOwnerAPI.get(`/connections/profile-owner?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connections');
      }
    },

    /**
     * Get connection details
     * @param {string} connectionId - Connection ID
     * @returns {Promise}
     */
    getConnectionDetails: async (connectionId) => {
      try {
        const response = await profileOwnerAPI.get(`/connections/${connectionId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connection details');
      }
    },

    /**
     * Mark connection as contacted
     * @param {string} connectionId - Connection ID
     * @returns {Promise}
     */
    markAsContacted: async (connectionId) => {
      try {
        const response = await profileOwnerAPI.put(`/connections/${connectionId}/contacted`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to mark as contacted');
      }
    },

    /**
     * Update connection status
     * @param {string} connectionId - Connection ID
     * @param {string} status - New status
     * @param {string} notes - Optional notes
     * @returns {Promise}
     */
    updateConnectionStatus: async (connectionId, status, notes = '') => {
      try {
        const response = await profileOwnerAPI.put(`/connections/${connectionId}/status`, {
          status,
          notes,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update connection status');
      }
    },

    /**
     * Get connection statistics
     * @returns {Promise}
     */
    getConnectionStats: async () => {
      try {
        const response = await profileOwnerAPI.get('/connections/profile-owner/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get connection stats');
      }
    },

    /**
     * Get client details from connection
     * @param {string} connectionId - Connection ID
     * @returns {Promise}
     */
    getClientDetails: async (connectionId) => {
      try {
        const response = await profileOwnerAPI.get(`/connections/${connectionId}/client`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get client details');
      }
    },
  },

  // Analytics and Performance Services
  analytics: {
    /**
     * Get dashboard analytics
     * @returns {Promise}
     */
    getDashboardAnalytics: async () => {
      try {
        const response = await profileOwnerAPI.get('/analytics/profile-owner/dashboard');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get dashboard analytics');
      }
    },

    /**
     * Get performance metrics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getPerformanceMetrics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await profileOwnerAPI.get(`/analytics/profile-owner/performance?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get performance metrics');
      }
    },

    /**
     * Get view statistics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getViewStatistics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await profileOwnerAPI.get(`/analytics/profile-owner/views?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get view statistics');
      }
    },

    /**
     * Get search appearance statistics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getSearchAppearanceStats: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await profileOwnerAPI.get(`/analytics/profile-owner/search-appearances?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get search appearance stats');
      }
    },
  },

  // Portfolio and Project Services
  portfolio: {
    /**
     * Add project to portfolio
     * @param {Object} projectData - Project details
     * @returns {Promise}
     */
    addProject: async (projectData) => {
      try {
        const response = await profileOwnerAPI.post('/portfolio/projects', projectData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add project');
      }
    },

    /**
     * Get portfolio projects
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getProjects: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await profileOwnerAPI.get(`/portfolio/projects?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get portfolio projects');
      }
    },

    /**
     * Update portfolio project
     * @param {string} projectId - Project ID
     * @param {Object} projectData - Updated project data
     * @returns {Promise}
     */
    updateProject: async (projectId, projectData) => {
      try {
        const response = await profileOwnerAPI.put(`/portfolio/projects/${projectId}`, projectData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update project');
      }
    },

    /**
     * Delete portfolio project
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    deleteProject: async (projectId) => {
      try {
        const response = await profileOwnerAPI.delete(`/portfolio/projects/${projectId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete project');
      }
    },

    /**
     * Upload project images
     * @param {string} projectId - Project ID
     * @param {FormData} formData - Image files
     * @returns {Promise}
     */
    uploadProjectImages: async (projectId, formData) => {
      try {
        const response = await profileOwnerAPI.post(`/portfolio/projects/${projectId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload project images');
      }
    },
  },

  // Reviews and Ratings Services
  reviews: {
    /**
     * Get profile owner's reviews
     * @param {Object} options - Pagination and filtering options
     * @returns {Promise}
     */
    getReviews: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.rating) params.append('rating', options.rating);

        const response = await profileOwnerAPI.get(`/reviews?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get reviews');
      }
    },

    /**
     * Respond to a review
     * @param {string} reviewId - Review ID
     * @param {string} responseText - Response text
     * @returns {Promise}
     */
    respondToReview: async (reviewId, responseText) => {
      try {
        const response = await profileOwnerAPI.post(`/reviews/${reviewId}/respond`, { response: responseText });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to respond to review');
      }
    },

    /**
     * Get review statistics
     * @returns {Promise}
     */
    getReviewStats: async () => {
      try {
        const response = await profileOwnerAPI.get('/reviews/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get review stats');
      }
    },

    /**
     * Report inappropriate review
     * @param {string} reviewId - Review ID
     * @param {string} reason - Report reason
     * @returns {Promise}
     */
    reportReview: async (reviewId, reason) => {
      try {
        const response = await profileOwnerAPI.post(`/reviews/${reviewId}/report`, { reason });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to report review');
      }
    },
  },

  // Notification and Communication Services
  notifications: {
    /**
     * Get profile owner's notifications
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getNotifications: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.unreadOnly) params.append('unreadOnly', 'true');
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await profileOwnerAPI.get(`/notifications?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get notifications');
      }
    },

    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     * @returns {Promise}
     */
    markAsRead: async (notificationId) => {
      try {
        const response = await profileOwnerAPI.put(`/notifications/${notificationId}/read`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
      }
    },

    /**
     * Mark all notifications as read
     * @returns {Promise}
     */
    markAllAsRead: async () => {
      try {
        const response = await profileOwnerAPI.put('/notifications/read-all');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to mark all as read');
      }
    },

    /**
     * Update notification preferences
     * @param {Object} preferences - Notification preferences
     * @returns {Promise}
     */
    updateNotificationPreferences: async (preferences) => {
      try {
        const response = await profileOwnerAPI.put('/notifications/preferences', preferences);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update notification preferences');
      }
    },

    /**
     * Get notification preferences
     * @returns {Promise}
     */
    getNotificationPreferences: async () => {
      try {
        const response = await profileOwnerAPI.get('/notifications/preferences');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get notification preferences');
      }
    },
  },

  // Settings and Preferences Services
  settings: {
    /**
     * Update profile owner settings
     * @param {Object} settings - Settings data
     * @returns {Promise}
     */
    updateSettings: async (settings) => {
      try {
        const response = await profileOwnerAPI.put('/profile-owners/settings', settings);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update settings');
      }
    },

    /**
     * Get profile owner settings
     * @returns {Promise}
     */
    getSettings: async () => {
      try {
        const response = await profileOwnerAPI.get('/profile-owners/settings');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get settings');
      }
    },

    /**
     * Update contact preferences
     * @param {Object} preferences - Contact preferences
     * @returns {Promise}
     */
    updateContactPreferences: async (preferences) => {
      try {
        const response = await profileOwnerAPI.put('/profile-owners/contact-preferences', preferences);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update contact preferences');
      }
    },

    /**
     * Verify phone number
     * @param {string} phoneNumber - Phone number to verify
     * @returns {Promise}
     */
    verifyPhone: async (phoneNumber) => {
      try {
        const response = await profileOwnerAPI.post('/profile-owners/verify-phone', { phoneNumber });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to verify phone');
      }
    },

    /**
     * Confirm phone verification
     * @param {string} code - Verification code
     * @returns {Promise}
     */
    confirmPhoneVerification: async (code) => {
      try {
        const response = await profileOwnerAPI.post('/profile-owners/confirm-phone', { code });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to confirm phone verification');
      }
    },
  },
};

// Export both default and named exports
export default profileOwnerService;
export const {
  profile,
  documents,
  moodle,
  ranking,
  connections,
  analytics,
  portfolio,
  reviews,
  notifications,
  settings,
} = profileOwnerService;

// Hook for using profile owner service in React components
export const useProfileOwnerService = () => {
  return profileOwnerService;
};