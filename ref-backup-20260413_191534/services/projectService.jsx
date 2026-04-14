import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const projectAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
projectAPI.interceptors.request.use(
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
projectAPI.interceptors.response.use(
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

const projectService = {
  // Project CRUD Operations
  projects: {
    /**
     * Create a new project
     * @param {Object} projectData - Project details
     * @returns {Promise}
     */
    createProject: async (projectData) => {
      try {
        const response = await projectAPI.post('/projects', projectData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create project');
      }
    },

    /**
     * Get all projects for current user
     * @param {Object} options - Filtering and pagination options
     * @returns {Promise}
     */
    getProjects: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.type) params.append('type', options.type);
        if (options.category) params.append('category', options.category);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options.search) params.append('search', options.search);

        const response = await projectAPI.get(`/projects?${params}`);
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
        const response = await projectAPI.get(`/projects/${projectId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project details');
      }
    },

    /**
     * Update project details
     * @param {string} projectId - Project ID
     * @param {Object} updates - Project updates
     * @returns {Promise}
     */
    updateProject: async (projectId, updates) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update project');
      }
    },

    /**
     * Delete project
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    deleteProject: async (projectId) => {
      try {
        const response = await projectAPI.delete(`/projects/${projectId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete project');
      }
    },

    /**
     * Duplicate project
     * @param {string} projectId - Project ID
     * @param {Object} options - Duplication options
     * @returns {Promise}
     */
    duplicateProject: async (projectId, options = {}) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/duplicate`, options);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to duplicate project');
      }
    },

    /**
     * Archive project
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    archiveProject: async (projectId) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/archive`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to archive project');
      }
    },

    /**
     * Restore archived project
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    restoreProject: async (projectId) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/restore`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to restore project');
      }
    },
  },

  // Project Status and Workflow Services
  status: {
    /**
     * Update project status
     * @param {string} projectId - Project ID
     * @param {string} status - New status
     * @param {string} reason - Reason for status change (optional)
     * @returns {Promise}
     */
    updateStatus: async (projectId, status, reason = '') => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/status`, {
          status,
          reason,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update project status');
      }
    },

    /**
     * Get project status history
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getStatusHistory: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/status-history`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get status history');
      }
    },

    /**
     * Request project approval
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    requestApproval: async (projectId) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/request-approval`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to request approval');
      }
    },

    /**
     * Approve project
     * @param {string} projectId - Project ID
     * @param {string} comments - Approval comments (optional)
     * @returns {Promise}
     */
    approveProject: async (projectId, comments = '') => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/approve`, { comments });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to approve project');
      }
    },

    /**
     * Reject project
     * @param {string} projectId - Project ID
     * @param {string} reason - Rejection reason
     * @returns {Promise}
     */
    rejectProject: async (projectId, reason) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/reject`, { reason });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to reject project');
      }
    },
  },

  // Milestone Management Services
  milestones: {
    /**
     * Add milestone to project
     * @param {string} projectId - Project ID
     * @param {Object} milestoneData - Milestone details
     * @returns {Promise}
     */
    addMilestone: async (projectId, milestoneData) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/milestones`, milestoneData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add milestone');
      }
    },

    /**
     * Get project milestones
     * @param {string} projectId - Project ID
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getMilestones: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.completed) params.append('completed', options.completed);

        const response = await projectAPI.get(`/projects/${projectId}/milestones?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get milestones');
      }
    },

    /**
     * Update milestone
     * @param {string} projectId - Project ID
     * @param {string} milestoneId - Milestone ID
     * @param {Object} updates - Milestone updates
     * @returns {Promise}
     */
    updateMilestone: async (projectId, milestoneId, updates) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/milestones/${milestoneId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update milestone');
      }
    },

    /**
     * Delete milestone
     * @param {string} projectId - Project ID
     * @param {string} milestoneId - Milestone ID
     * @returns {Promise}
     */
    deleteMilestone: async (projectId, milestoneId) => {
      try {
        const response = await projectAPI.delete(`/projects/${projectId}/milestones/${milestoneId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete milestone');
      }
    },

    /**
     * Mark milestone as completed
     * @param {string} projectId - Project ID
     * @param {string} milestoneId - Milestone ID
     * @param {Object} completionData - Completion data
     * @returns {Promise}
     */
    completeMilestone: async (projectId, milestoneId, completionData = {}) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/milestones/${milestoneId}/complete`, completionData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to complete milestone');
      }
    },

    /**
     * Reopen milestone
     * @param {string} projectId - Project ID
     * @param {string} milestoneId - Milestone ID
     * @returns {Promise}
     */
    reopenMilestone: async (projectId, milestoneId) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/milestones/${milestoneId}/reopen`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to reopen milestone');
      }
    },

    /**
     * Reorder milestones
     * @param {string} projectId - Project ID
     * @param {string[]} milestoneIds - Ordered milestone IDs
     * @returns {Promise}
     */
    reorderMilestones: async (projectId, milestoneIds) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/milestones/reorder`, { milestoneIds });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to reorder milestones');
      }
    },
  },

  // Progress Tracking Services
  progress: {
    /**
     * Update project progress
     * @param {string} projectId - Project ID
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} notes - Progress notes (optional)
     * @returns {Promise}
     */
    updateProgress: async (projectId, progress, notes = '') => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/progress`, {
          progress,
          notes,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update progress');
      }
    },

    /**
     * Get progress history
     * @param {string} projectId - Project ID
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getProgressHistory: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await projectAPI.get(`/projects/${projectId}/progress-history?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get progress history');
      }
    },

    /**
     * Add progress update
     * @param {string} projectId - Project ID
     * @param {Object} updateData - Progress update data
     * @returns {Promise}
     */
    addProgressUpdate: async (projectId, updateData) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/progress-updates`, updateData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add progress update');
      }
    },

    /**
     * Get progress updates
     * @param {string} projectId - Project ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getProgressUpdates: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await projectAPI.get(`/projects/${projectId}/progress-updates?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get progress updates');
      }
    },
  },

  // Document Management Services
  documents: {
    /**
     * Upload project document
     * @param {string} projectId - Project ID
     * @param {FormData} formData - Document data
     * @param {Object} metadata - Document metadata
     * @returns {Promise}
     */
    uploadDocument: async (projectId, formData, metadata = {}) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: metadata,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload document');
      }
    },

    /**
     * Get project documents
     * @param {string} projectId - Project ID
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getDocuments: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.type) params.append('type', options.type);
        if (options.category) params.append('category', options.category);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await projectAPI.get(`/projects/${projectId}/documents?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project documents');
      }
    },

    /**
     * Update document metadata
     * @param {string} projectId - Project ID
     * @param {string} documentId - Document ID
     * @param {Object} updates - Document updates
     * @returns {Promise}
     */
    updateDocument: async (projectId, documentId, updates) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/documents/${documentId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update document');
      }
    },

    /**
     * Delete project document
     * @param {string} projectId - Project ID
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    deleteDocument: async (projectId, documentId) => {
      try {
        const response = await projectAPI.delete(`/projects/${projectId}/documents/${documentId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete document');
      }
    },

    /**
     * Download project document
     * @param {string} projectId - Project ID
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    downloadDocument: async (projectId, documentId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/documents/${documentId}/download`, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to download document');
      }
    },

    /**
     * Get document preview URL
     * @param {string} projectId - Project ID
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    getDocumentPreview: async (projectId, documentId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/documents/${documentId}/preview`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get document preview');
      }
    },
  },

  // Team and Assignment Services
  team: {
    /**
     * Assign profile owner to project
     * @param {string} projectId - Project ID
     * @param {string} profileOwnerId - Profile owner ID
     * @param {Object} assignmentData - Assignment details
     * @returns {Promise}
     */
    assignProfileOwner: async (projectId, profileOwnerId, assignmentData = {}) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/assign`, {
          profileOwnerId,
          ...assignmentData,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to assign profile owner');
      }
    },

    /**
     * Remove profile owner from project
     * @param {string} projectId - Project ID
     * @param {string} profileOwnerId - Profile owner ID
     * @returns {Promise}
     */
    removeProfileOwner: async (projectId, profileOwnerId) => {
      try {
        const response = await projectAPI.delete(`/projects/${projectId}/assign/${profileOwnerId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to remove profile owner');
      }
    },

    /**
     * Get project team members
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getTeamMembers: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/team`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get team members');
      }
    },

    /**
     * Update team member role
     * @param {string} projectId - Project ID
     * @param {string} profileOwnerId - Profile owner ID
     * @param {string} role - New role
     * @returns {Promise}
     */
    updateTeamMemberRole: async (projectId, profileOwnerId, role) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/team/${profileOwnerId}/role`, { role });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update team member role');
      }
    },

    /**
     * Get available profile owners for project
     * @param {string} projectId - Project ID
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getAvailableProfileOwners: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.skills) params.append('skills', options.skills);
        if (options.category) params.append('category', options.category);

        const response = await projectAPI.get(`/projects/${projectId}/available-profile-owners?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get available profile owners');
      }
    },
  },

  // Communication and Collaboration Services
  communication: {
    /**
     * Add comment to project
     * @param {string} projectId - Project ID
     * @param {Object} commentData - Comment data
     * @returns {Promise}
     */
    addComment: async (projectId, commentData) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/comments`, commentData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add comment');
      }
    },

    /**
     * Get project comments
     * @param {string} projectId - Project ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getComments: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await projectAPI.get(`/projects/${projectId}/comments?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get comments');
      }
    },

    /**
     * Update comment
     * @param {string} projectId - Project ID
     * @param {string} commentId - Comment ID
     * @param {Object} updates - Comment updates
     * @returns {Promise}
     */
    updateComment: async (projectId, commentId, updates) => {
      try {
        const response = await projectAPI.put(`/projects/${projectId}/comments/${commentId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update comment');
      }
    },

    /**
     * Delete comment
     * @param {string} projectId - Project ID
     * @param {string} commentId - Comment ID
     * @returns {Promise}
     */
    deleteComment: async (projectId, commentId) => {
      try {
        const response = await projectAPI.delete(`/projects/${projectId}/comments/${commentId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete comment');
      }
    },

    /**
     * Get project activity feed
     * @param {string} projectId - Project ID
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getActivityFeed: async (projectId, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await projectAPI.get(`/projects/${projectId}/activity?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get activity feed');
      }
    },
  },

  // Analytics and Reporting Services
  analytics: {
    /**
     * Get project analytics
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getProjectAnalytics: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/analytics`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project analytics');
      }
    },

    /**
     * Get project timeline analytics
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getTimelineAnalytics: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/analytics/timeline`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get timeline analytics');
      }
    },

    /**
     * Get resource utilization
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getResourceUtilization: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/analytics/resources`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get resource utilization');
      }
    },

    /**
     * Generate project report
     * @param {string} projectId - Project ID
     * @param {Object} options - Report options
     * @returns {Promise}
     */
    generateReport: async (projectId, options = {}) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/reports`, options, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to generate report');
      }
    },

    /**
     * Get project KPIs
     * @param {string} projectId - Project ID
     * @returns {Promise}
     */
    getKPIs: async (projectId) => {
      try {
        const response = await projectAPI.get(`/projects/${projectId}/kpis`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project KPIs');
      }
    },
  },

  // Templates and Workflows
  templates: {
    /**
     * Get project templates
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getTemplates: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.type) params.append('type', options.type);

        const response = await projectAPI.get(`/project-templates?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get project templates');
      }
    },

    /**
     * Create project from template
     * @param {string} templateId - Template ID
     * @param {Object} projectData - Project data
     * @returns {Promise}
     */
    createFromTemplate: async (templateId, projectData) => {
      try {
        const response = await projectAPI.post(`/project-templates/${templateId}/create`, projectData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create project from template');
      }
    },

    /**
     * Save project as template
     * @param {string} projectId - Project ID
     * @param {Object} templateData - Template data
     * @returns {Promise}
     */
    saveAsTemplate: async (projectId, templateData) => {
      try {
        const response = await projectAPI.post(`/projects/${projectId}/save-as-template`, templateData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to save project as template');
      }
    },
  },
};

// Export both default and named exports
export default projectService;
export const {
  projects,
  status,
  milestones,
  progress,
  documents,
  team,
  communication,
  analytics,
  templates,
} = projectService;

// Hook for using project service in React components
export const useProjectService = () => {
  return projectService;
};

// Utility functions for project management
export const projectUtils = {
  /**
   * Validate project data before submission
   * @param {Object} projectData - Project data to validate
   * @returns {Object} Validation result
   */
  validateProjectData: (projectData) => {
    const errors = [];
    
    if (!projectData.title?.trim()) {
      errors.push('Project title is required');
    }
    
    if (!projectData.description?.trim()) {
      errors.push('Project description is required');
    }
    
    if (!projectData.budget || projectData.budget <= 0) {
      errors.push('Valid budget is required');
    }
    
    if (!projectData.timeline || projectData.timeline <= 0) {
      errors.push('Valid timeline is required');
    }
    
    if (!projectData.serviceCategory) {
      errors.push('Service category is required');
    }
    
    if (!projectData.requirements?.trim()) {
      errors.push('Project requirements are required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Format project status for display
   * @param {string} status - Raw status
   * @returns {Object} Formatted status with color and text
   */
  formatProjectStatus: (status) => {
    const statusMap = {
      draft: { text: 'Draft', color: 'secondary', variant: 'secondary' },
      pending_approval: { text: 'Pending Approval', color: 'warning', variant: 'warning' },
      approved: { text: 'Approved', color: 'success', variant: 'success' },
      active: { text: 'Active', color: 'primary', variant: 'primary' },
      on_hold: { text: 'On Hold', color: 'warning', variant: 'warning' },
      completed: { text: 'Completed', color: 'success', variant: 'success' },
      cancelled: { text: 'Cancelled', color: 'danger', variant: 'danger' },
      archived: { text: 'Archived', color: 'secondary', variant: 'secondary' },
    };
    
    return statusMap[status] || { text: 'Unknown', color: 'secondary', variant: 'secondary' };
  },

  /**
   * Calculate project progress
   * @param {Object} project - Project object
   * @returns {number} Progress percentage
   */
  calculateProjectProgress: (project) => {
    if (project.progress !== undefined && project.progress !== null) {
      return project.progress;
    }
    
    // Calculate based on milestones if progress is not provided
    if (project.milestones && project.milestones.length > 0) {
      const completedMilestones = project.milestones.filter(m => m.completed);
      return (completedMilestones.length / project.milestones.length) * 100;
    }
    
    return 0;
  },

  /**
   * Get progress color based on percentage
   * @param {number} progress - Progress percentage
   * @returns {string} Bootstrap color class
   */
  getProgressColor: (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'info';
    if (progress >= 50) return 'primary';
    if (progress >= 30) return 'warning';
    return 'danger';
  },

  /**
   * Format budget for display
   * @param {number} budget - Budget amount
   * @param {string} currency - Currency code
   * @returns {string} Formatted budget
   */
  formatBudget: (budget, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  },

  /**
   * Calculate project duration
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Object} Duration object
   */
  calculateDuration: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      weeks: Math.ceil(diffDays / 7),
      months: Math.ceil(diffDays / 30),
    };
  },

  /**
   * Check if project is overdue
   * @param {Object} project - Project object
   * @returns {boolean} Overdue status
   */
  isProjectOverdue: (project) => {
    if (!project.endDate || project.status === 'completed') return false;
    
    const endDate = new Date(project.endDate);
    const today = new Date();
    
    return today > endDate;
  },

  /**
   * Get days remaining until deadline
   * @param {string} endDate - End date
   * @returns {number} Days remaining
   */
  getDaysRemaining: (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Generate project timeline options
   * @returns {Array} Timeline options
   */
  getTimelineOptions: () => {
    return [
      { value: 7, label: '1 Week' },
      { value: 14, label: '2 Weeks' },
      { value: 30, label: '1 Month' },
      { value: 60, label: '2 Months' },
      { value: 90, label: '3 Months' },
      { value: 180, label: '6 Months' },
      { value: 365, label: '1 Year' },
    ];
  },

  /**
   * Sort projects by various criteria
   * @param {Array} projects - Projects array
   * @param {string} sortBy - Sort criteria
   * @param {string} sortOrder - Sort order (asc/desc)
   * @returns {Array} Sorted projects
   */
  sortProjects: (projects, sortBy = 'createdAt', sortOrder = 'desc') => {
    const sorted = [...projects];
    
    sorted.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle nested properties
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      }
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  },
};
export {projectService}