import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const moodleAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 15000, // Longer timeout for Moodle API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
moodleAPI.interceptors.request.use(
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
moodleAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle Moodle-specific errors
    if (error.response?.data?.error?.includes('Moodle')) {
      console.error('Moodle API Error:', error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

const moodleService = {
  // Account Linking and Authentication Services
  auth: {
    /**
     * Link Moodle account with Tham Platform profile
     * @param {Object} credentials - Moodle username and password
     * @returns {Promise}
     */
    linkAccount: async (credentials) => {
      try {
        const response = await moodleAPI.post('/moodle/link-account', credentials);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to link Moodle account');
      }
    },

    /**
     * Unlink Moodle account
     * @returns {Promise}
     */
    unlinkAccount: async () => {
      try {
        const response = await moodleAPI.delete('/moodle/link-account');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to unlink Moodle account');
      }
    },

    /**
     * Check if Moodle account is linked
     * @returns {Promise}
     */
    checkLinkStatus: async () => {
      try {
        const response = await moodleAPI.get('/moodle/link-status');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to check link status');
      }
    },

    /**
     * Verify Moodle credentials without linking
     * @param {Object} credentials - Moodle username and password
     * @returns {Promise}
     */
    verifyCredentials: async (credentials) => {
      try {
        const response = await moodleAPI.post('/moodle/verify-credentials', credentials);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Invalid Moodle credentials');
      }
    },

    /**
     * Get Moodle user information
     * @returns {Promise}
     */
    getUserInfo: async () => {
      try {
        const response = await moodleAPI.get('/moodle/user-info');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get user info');
      }
    },
  },

  // Course Management Services
  courses: {
    /**
     * Get all available courses from Moodle
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getAvailableCourses: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.search) params.append('search', options.search);
        if (options.enrollableOnly) params.append('enrollableOnly', 'true');
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await moodleAPI.get(`/moodle/courses?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get available courses');
      }
    },

    /**
     * Get course details
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCourseDetails: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course details');
      }
    },

    /**
     * Get course content and modules
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCourseContent: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/content`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course content');
      }
    },

    /**
     * Enroll in a course
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    enrollInCourse: async (courseId) => {
      try {
        const response = await moodleAPI.post(`/moodle/courses/${courseId}/enroll`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to enroll in course');
      }
    },

    /**
     * Unenroll from a course
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    unenrollFromCourse: async (courseId) => {
      try {
        const response = await moodleAPI.delete(`/moodle/courses/${courseId}/enroll`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to unenroll from course');
      }
    },

    /**
     * Get recommended courses based on profile
     * @returns {Promise}
     */
    getRecommendedCourses: async () => {
      try {
        const response = await moodleAPI.get('/moodle/courses/recommended');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get recommended courses');
      }
    },

    /**
     * Search courses
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Promise}
     */
    searchCourses: async (query, options = {}) => {
      try {
        const params = new URLSearchParams();
        params.append('q', query);
        if (options.category) params.append('category', options.category);
        if (options.difficulty) params.append('difficulty', options.difficulty);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await moodleAPI.get(`/moodle/courses/search?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to search courses');
      }
    },
  },

  // Course Progress and Enrollment Services
  progress: {
    /**
     * Get user's course enrollments and progress
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getCourseProgress: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.category) params.append('category', options.category);
        if (options.includeDetails) params.append('includeDetails', 'true');

        const response = await moodleAPI.get(`/moodle/user-progress?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course progress');
      }
    },

    /**
     * Get detailed progress for a specific course
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCourseDetailedProgress: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/progress`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course progress details');
      }
    },

    /**
     * Sync course progress with Moodle
     * @param {string} courseId - Specific course ID (optional, syncs all if not provided)
     * @returns {Promise}
     */
    syncProgress: async (courseId = null) => {
      try {
        const url = courseId 
          ? `/moodle/sync-progress/${courseId}`
          : '/moodle/sync-progress';
        
        const response = await moodleAPI.post(url);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to sync progress');
      }
    },

    /**
     * Get course completion status
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCompletionStatus: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/completion`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get completion status');
      }
    },

    /**
     * Mark course module as completed
     * @param {string} courseId - Moodle course ID
     * @param {string} moduleId - Module ID
     * @returns {Promise}
     */
    markModuleCompleted: async (courseId, moduleId) => {
      try {
        const response = await moodleAPI.post(`/moodle/courses/${courseId}/modules/${moduleId}/complete`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to mark module completed');
      }
    },

    /**
     * Get progress statistics
     * @returns {Promise}
     */
    getProgressStatistics: async () => {
      try {
        const response = await moodleAPI.get('/moodle/progress-statistics');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get progress statistics');
      }
    },
  },

  // Grades and Assessment Services
  grades: {
    /**
     * Get grades for all courses
     * @returns {Promise}
     */
    getAllGrades: async () => {
      try {
        const response = await moodleAPI.get('/moodle/grades');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get grades');
      }
    },

    /**
     * Get grades for a specific course
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCourseGrades: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/grades`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course grades');
      }
    },

    /**
     * Get grade breakdown for an assignment/quiz
     * @param {string} courseId - Moodle course ID
     * @param {string} gradeItemId - Grade item ID
     * @returns {Promise}
     */
    getGradeDetails: async (courseId, gradeItemId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/grades/${gradeItemId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get grade details');
      }
    },

    /**
     * Calculate GPA based on course grades
     * @returns {Promise}
     */
    calculateGPA: async () => {
      try {
        const response = await moodleAPI.get('/moodle/gpa');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to calculate GPA');
      }
    },

    /**
     * Get grade history
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getGradeHistory: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await moodleAPI.get(`/moodle/grade-history?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get grade history');
      }
    },
  },

  // Certificates and Achievements Services
  certificates: {
    /**
     * Get all earned certificates
     * @returns {Promise}
     */
    getCertificates: async () => {
      try {
        const response = await moodleAPI.get('/moodle/certificates');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get certificates');
      }
    },

    /**
     * Get certificate for a specific course
     * @param {string} courseId - Moodle course ID
     * @returns {Promise}
     */
    getCourseCertificate: async (courseId) => {
      try {
        const response = await moodleAPI.get(`/moodle/courses/${courseId}/certificate`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get course certificate');
      }
    },

    /**
     * Download certificate as PDF
     * @param {string} certificateId - Certificate ID
     * @returns {Promise}
     */
    downloadCertificate: async (certificateId) => {
      try {
        const response = await moodleAPI.get(`/moodle/certificates/${certificateId}/download`, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to download certificate');
      }
    },

    /**
     * Share certificate via email or social media
     * @param {string} certificateId - Certificate ID
     * @param {Object} shareOptions - Share options
     * @returns {Promise}
     */
    shareCertificate: async (certificateId, shareOptions) => {
      try {
        const response = await moodleAPI.post(`/moodle/certificates/${certificateId}/share`, shareOptions);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to share certificate');
      }
    },

    /**
     * Verify certificate authenticity
     * @param {string} certificateId - Certificate ID
     * @returns {Promise}
     */
    verifyCertificate: async (certificateId) => {
      try {
        const response = await moodleAPI.get(`/moodle/certificates/${certificateId}/verify`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to verify certificate');
      }
    },
  },

  // Categories and Organization Services
  categories: {
    /**
     * Get all course categories
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getCategories: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.parentId) params.append('parentId', options.parentId);
        if (options.includeCourses) params.append('includeCourses', 'true');

        const response = await moodleAPI.get(`/moodle/categories?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get categories');
      }
    },

    /**
     * Get category details
     * @param {string} categoryId - Category ID
     * @returns {Promise}
     */
    getCategoryDetails: async (categoryId) => {
      try {
        const response = await moodleAPI.get(`/moodle/categories/${categoryId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get category details');
      }
    },

    /**
     * Get courses in a category
     * @param {string} categoryId - Category ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getCategoryCourses: async (categoryId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await moodleAPI.get(`/moodle/categories/${categoryId}/courses?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get category courses');
      }
    },

    /**
     * Get category tree (hierarchy)
     * @returns {Promise}
     */
    getCategoryTree: async () => {
      try {
        const response = await moodleAPI.get('/moodle/categories/tree');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get category tree');
      }
    },
  },

  // Analytics and Reporting Services
  analytics: {
    /**
     * Get learning analytics dashboard
     * @returns {Promise}
     */
    getLearningAnalytics: async () => {
      try {
        const response = await moodleAPI.get('/moodle/analytics/learning');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get learning analytics');
      }
    },

    /**
     * Get course engagement metrics
     * @param {string} courseId - Course ID (optional)
     * @returns {Promise}
     */
    getEngagementMetrics: async (courseId = null) => {
      try {
        const url = courseId 
          ? `/moodle/analytics/engagement/${courseId}`
          : '/moodle/analytics/engagement';
        
        const response = await moodleAPI.get(url);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get engagement metrics');
      }
    },

    /**
     * Get time spent on courses
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getTimeSpent: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await moodleAPI.get(`/moodle/analytics/time-spent?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get time spent analytics');
      }
    },

    /**
     * Get completion rate analytics
     * @returns {Promise}
     */
    getCompletionAnalytics: async () => {
      try {
        const response = await moodleAPI.get('/moodle/analytics/completion');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get completion analytics');
      }
    },

    /**
     * Compare performance with peers
     * @returns {Promise}
     */
    getPeerComparison: async () => {
      try {
        const response = await moodleAPI.get('/moodle/analytics/peer-comparison');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get peer comparison');
      }
    },
  },

  // System and Admin Services
  system: {
    /**
     * Get Moodle system status
     * @returns {Promise}
     */
    getSystemStatus: async () => {
      try {
        const response = await moodleAPI.get('/moodle/system/status');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get system status');
      }
    },

    /**
     * Sync entire course catalog (admin function)
     * @returns {Promise}
     */
    syncCourseCatalog: async () => {
      try {
        const response = await moodleAPI.post('/moodle/sync-catalog');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to sync course catalog');
      }
    },

    /**
     * Get synchronization logs
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getSyncLogs: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.type) params.append('type', options.type);

        const response = await moodleAPI.get(`/moodle/sync-logs?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get sync logs');
      }
    },

    /**
     * Test Moodle connection
     * @returns {Promise}
     */
    testConnection: async () => {
      try {
        const response = await moodleAPI.get('/moodle/test-connection');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Moodle connection test failed');
      }
    },

    /**
     * Get API usage statistics
     * @returns {Promise}
     */
    getAPIUsage: async () => {
      try {
        const response = await moodleAPI.get('/moodle/api-usage');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get API usage');
      }
    },
  },

  // Utility Services
  utils: {
    /**
     * Export course progress as PDF report
     * @param {Object} options - Export options
     * @returns {Promise}
     */
    exportProgressReport: async (options = {}) => {
      try {
        const response = await moodleAPI.post('/moodle/export/progress-report', options, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to export progress report');
      }
    },

    /**
     * Generate learning transcript
     * @returns {Promise}
     */
    generateTranscript: async () => {
      try {
        const response = await moodleAPI.get('/moodle/transcript', {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to generate transcript');
      }
    },

    /**
     * Set learning goals
     * @param {Object} goals - Learning goals
     * @returns {Promise}
     */
    setLearningGoals: async (goals) => {
      try {
        const response = await moodleAPI.post('/moodle/learning-goals', goals);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to set learning goals');
      }
    },

    /**
     * Get learning goals
     * @returns {Promise}
     */
    getLearningGoals: async () => {
      try {
        const response = await moodleAPI.get('/moodle/learning-goals');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get learning goals');
      }
    },
  },
};

// Export both default and named exports
export default moodleService;
export const {
  auth,
  courses,
  progress,
  grades,
  certificates,
  categories,
  analytics,
  system,
  utils,
} = moodleService;

// Hook for using moodle service in React components
export const useMoodleService = () => {
  return moodleService;
};

// Utility functions for Moodle integration
export const moodleUtils = {
  /**
   * Calculate course completion percentage
   * @param {Object} courseProgress - Course progress object
   * @returns {number} Completion percentage
   */
  calculateCompletionPercentage: (courseProgress) => {
    if (!courseProgress || !courseProgress.modules) return 0;
    
    const completedModules = courseProgress.modules.filter(module => module.completed);
    return (completedModules.length / courseProgress.modules.length) * 100;
  },

  /**
   * Format grade for display
   * @param {number} grade - Raw grade
   * @param {number} maxGrade - Maximum possible grade
   * @returns {string} Formatted grade
   */
  formatGrade: (grade, maxGrade = 100) => {
    if (grade === null || grade === undefined) return 'N/A';
    return `${grade}/${maxGrade} (${((grade / maxGrade) * 100).toFixed(1)}%)`;
  },

  /**
   * Get course difficulty level based on metadata
   * @param {Object} course - Course object
   * @returns {string} Difficulty level
   */
  getCourseDifficulty: (course) => {
    const duration = course.durationHours || 0;
    if (duration > 40) return 'Advanced';
    if (duration > 20) return 'Intermediate';
    return 'Beginner';
  },

  /**
   * Check if course is eligible for ranking points
   * @param {Object} course - Course object
   * @returns {boolean}
   */
  isEligibleForRanking: (course) => {
    return course.isActive && 
           course.hasCertificate && 
           (course.finalGrade || 0) >= 60; // Minimum passing grade
  },

  /**
   * Calculate ranking points from course performance
   * @param {Object} course - Course object with grade and metadata
   * @returns {number} Ranking points
   */
  calculateRankingPoints: (course) => {
    if (!course.finalGrade) return 0;
    
    const basePoints = 10; // Base points for completion
    const gradeMultiplier = course.finalGrade / 100; // Grade as multiplier
    const difficultyMultiplier = {
      'Beginner': 1,
      'Intermediate': 1.5,
      'Advanced': 2
    }[moodleUtils.getCourseDifficulty(course)] || 1;
    
    return Math.round(basePoints * gradeMultiplier * difficultyMultiplier);
  },
};

export { moodleService };