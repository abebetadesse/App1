import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const documentAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
documentAPI.interceptors.request.use(
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
documentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle file upload specific errors
    if (error.response?.data?.error?.includes('file') || error.response?.data?.error?.includes('upload')) {
      console.error('Document Upload Error:', error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

const documentService = {
  // Document Upload Services
  upload: {
    /**
     * Upload single document
     * @param {File} file - File to upload
     * @param {Object} metadata - Document metadata
     * @returns {Promise}
     */
    uploadDocument: async (file, metadata = {}) => {
      try {
        const formData = new FormData();
        formData.append('document', file);
        
        // Add metadata
        Object.keys(metadata).forEach(key => {
          formData.append(key, metadata[key]);
        });

        const response = await documentAPI.post('/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // You can emit this progress to a context or state management
            if (metadata.onProgress) {
              metadata.onProgress(progress);
            }
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload document');
      }
    },

    /**
     * Upload multiple documents
     * @param {File[]} files - Array of files to upload
     * @param {Object} metadata - Common metadata for all files
     * @returns {Promise}
     */
    uploadMultipleDocuments: async (files, metadata = {}) => {
      try {
        const formData = new FormData();
        
        // Append each file
        files.forEach((file, index) => {
          formData.append('documents', file);
        });

        // Add metadata
        Object.keys(metadata).forEach(key => {
          if (key !== 'onProgress') {
            formData.append(key, metadata[key]);
          }
        });

        const response = await documentAPI.post('/documents/upload-multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (metadata.onProgress) {
              metadata.onProgress(progress);
            }
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload documents');
      }
    },

    /**
     * Upload profile picture/avatar
     * @param {File} imageFile - Image file
     * @returns {Promise}
     */
    uploadProfilePicture: async (imageFile) => {
      try {
        const formData = new FormData();
        formData.append('avatar', imageFile);

        const response = await documentAPI.post('/documents/upload/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload profile picture');
      }
    },

    /**
     * Upload portfolio images
     * @param {File[]} imageFiles - Array of image files
     * @param {string} projectId - Project ID (optional)
     * @returns {Promise}
     */
    uploadPortfolioImages: async (imageFiles, projectId = null) => {
      try {
        const formData = new FormData();
        
        imageFiles.forEach((file, index) => {
          formData.append('portfolioImages', file);
        });

        if (projectId) {
          formData.append('projectId', projectId);
        }

        const response = await documentAPI.post('/documents/upload/portfolio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload portfolio images');
      }
    },

    /**
     * Upload certificate files
     * @param {File} certificateFile - Certificate file
     * @param {Object} metadata - Certificate metadata
     * @returns {Promise}
     */
    uploadCertificate: async (certificateFile, metadata = {}) => {
      try {
        const formData = new FormData();
        formData.append('certificate', certificateFile);

        Object.keys(metadata).forEach(key => {
          formData.append(key, metadata[key]);
        });

        const response = await documentAPI.post('/documents/upload/certificate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload certificate');
      }
    },
  },

  // Document Management Services
  management: {
    /**
     * Get all documents for current user
     * @param {Object} options - Filtering and pagination options
     * @returns {Promise}
     */
    getDocuments: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.type) params.append('type', options.type);
        if (options.category) params.append('category', options.category);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);

        const response = await documentAPI.get(`/documents?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get documents');
      }
    },

    /**
     * Get document by ID
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    getDocument: async (documentId) => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get document');
      }
    },

    /**
     * Update document metadata
     * @param {string} documentId - Document ID
     * @param {Object} updates - Document updates
     * @returns {Promise}
     */
    updateDocument: async (documentId, updates) => {
      try {
        const response = await documentAPI.put(`/documents/${documentId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update document');
      }
    },

    /**
     * Delete document
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    deleteDocument: async (documentId) => {
      try {
        const response = await documentAPI.delete(`/documents/${documentId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete document');
      }
    },

    /**
     * Delete multiple documents
     * @param {string[]} documentIds - Array of document IDs
     * @returns {Promise}
     */
    deleteMultipleDocuments: async (documentIds) => {
      try {
        const response = await documentAPI.post('/documents/delete-multiple', { documentIds });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete documents');
      }
    },

    /**
     * Update document visibility
     * @param {string} documentId - Document ID
     * @param {boolean} isPublic - Visibility status
     * @returns {Promise}
     */
    updateVisibility: async (documentId, isPublic) => {
      try {
        const response = await documentAPI.put(`/documents/${documentId}/visibility`, { isPublic });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update visibility');
      }
    },

    /**
     * Organize documents into categories
     * @param {string[]} documentIds - Array of document IDs
     * @param {string} category - New category
     * @returns {Promise}
     */
    organizeDocuments: async (documentIds, category) => {
      try {
        const response = await documentAPI.put('/documents/organize', { documentIds, category });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to organize documents');
      }
    },
  },

  // Document Download and Preview Services
  access: {
    /**
     * Download document
     * @param {string} documentId - Document ID
     * @param {string} format - Download format (original, pdf, etc.)
     * @returns {Promise}
     */
    downloadDocument: async (documentId, format = 'original') => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}/download`, {
          params: { format },
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to download document');
      }
    },

    /**
     * Get document preview URL
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    getPreviewUrl: async (documentId) => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}/preview-url`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get preview URL');
      }
    },

    /**
     * Generate shareable link for document
     * @param {string} documentId - Document ID
     * @param {Object} options - Share options
     * @returns {Promise}
     */
    generateShareLink: async (documentId, options = {}) => {
      try {
        const response = await documentAPI.post(`/documents/${documentId}/share`, options);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to generate share link');
      }
    },

    /**
     * Revoke shareable link
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    revokeShareLink: async (documentId) => {
      try {
        const response = await documentAPI.delete(`/documents/${documentId}/share`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to revoke share link');
      }
    },

    /**
     * Get document thumbnail
     * @param {string} documentId - Document ID
     * @param {string} size - Thumbnail size (sm, md, lg)
     * @returns {Promise}
     */
    getThumbnail: async (documentId, size = 'md') => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}/thumbnail`, {
          params: { size },
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get thumbnail');
      }
    },
  },

  // Document Verification and Security Services
  verification: {
    /**
     * Verify document authenticity
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    verifyDocument: async (documentId) => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}/verify`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to verify document');
      }
    },

    /**
     * Scan document for viruses/malware
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    scanDocument: async (documentId) => {
      try {
        const response = await documentAPI.post(`/documents/${documentId}/scan`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to scan document');
      }
    },

    /**
     * Get document security info
     * @param {string} documentId - Document ID
     * @returns {Promise}
     */
    getSecurityInfo: async (documentId) => {
      try {
        const response = await documentAPI.get(`/documents/${documentId}/security`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get security info');
      }
    },

    /**
     * Set document access permissions
     * @param {string} documentId - Document ID
     * @param {Object} permissions - Access permissions
     * @returns {Promise}
     */
    setPermissions: async (documentId, permissions) => {
      try {
        const response = await documentAPI.put(`/documents/${documentId}/permissions`, permissions);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to set permissions');
      }
    },

    /**
     * Watermark document
     * @param {string} documentId - Document ID
     * @param {Object} watermarkOptions - Watermark settings
     * @returns {Promise}
     */
    addWatermark: async (documentId, watermarkOptions = {}) => {
      try {
        const response = await documentAPI.post(`/documents/${documentId}/watermark`, watermarkOptions);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add watermark');
      }
    },
  },

  // Document Analytics and Reporting Services
  analytics: {
    /**
     * Get document usage statistics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getUsageStatistics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await documentAPI.get(`/documents/analytics/usage?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get usage statistics');
      }
    },

    /**
     * Get storage usage
     * @returns {Promise}
     */
    getStorageUsage: async () => {
      try {
        const response = await documentAPI.get('/documents/analytics/storage');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get storage usage');
      }
    },

    /**
     * Get document access logs
     * @param {string} documentId - Document ID (optional)
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getAccessLogs: async (documentId = null, options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.action) params.append('action', options.action);

        const url = documentId 
          ? `/documents/${documentId}/analytics/access-logs?${params}`
          : `/documents/analytics/access-logs?${params}`;

        const response = await documentAPI.get(url);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get access logs');
      }
    },

    /**
     * Get popular documents
     * @param {Object} options - Time period options
     * @returns {Promise}
     */
    getPopularDocuments: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.period) params.append('period', options.period);
        if (options.limit) params.append('limit', options.limit);

        const response = await documentAPI.get(`/documents/analytics/popular?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get popular documents');
      }
    },
  },

  // Document Categories and Organization Services
  categories: {
    /**
     * Get all document categories
     * @returns {Promise}
     */
    getCategories: async () => {
      try {
        const response = await documentAPI.get('/documents/categories');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get categories');
      }
    },

    /**
     * Create new category
     * @param {Object} categoryData - Category data
     * @returns {Promise}
     */
    createCategory: async (categoryData) => {
      try {
        const response = await documentAPI.post('/documents/categories', categoryData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create category');
      }
    },

    /**
     * Update category
     * @param {string} categoryId - Category ID
     * @param {Object} updates - Category updates
     * @returns {Promise}
     */
    updateCategory: async (categoryId, updates) => {
      try {
        const response = await documentAPI.put(`/documents/categories/${categoryId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update category');
      }
    },

    /**
     * Delete category
     * @param {string} categoryId - Category ID
     * @returns {Promise}
     */
    deleteCategory: async (categoryId) => {
      try {
        const response = await documentAPI.delete(`/documents/categories/${categoryId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete category');
      }
    },

    /**
     * Get documents by category
     * @param {string} category - Category name
     * @param {Object} options - Pagination options
     * @returns {Promise}
     */
    getDocumentsByCategory: async (category, options = {}) => {
      try {
        const params = new URLSearchParams();
        params.append('category', category);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await documentAPI.get(`/documents/category/${category}?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get documents by category');
      }
    },
  },

  // Document Templates and Batch Operations
  templates: {
    /**
     * Get document templates
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getTemplates: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.type) params.append('type', options.type);
        if (options.category) params.append('category', options.category);

        const response = await documentAPI.get(`/documents/templates?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get templates');
      }
    },

    /**
     * Use template to create document
     * @param {string} templateId - Template ID
     * @param {Object} data - Template data
     * @returns {Promise}
     */
    useTemplate: async (templateId, data) => {
      try {
        const response = await documentAPI.post(`/documents/templates/${templateId}/use`, data);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to use template');
      }
    },

    /**
     * Batch update documents
     * @param {string[]} documentIds - Array of document IDs
     * @param {Object} updates - Batch updates
     * @returns {Promise}
     */
    batchUpdate: async (documentIds, updates) => {
      try {
        const response = await documentAPI.put('/documents/batch-update', { documentIds, updates });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to batch update documents');
      }
    },

    /**
     * Export documents as zip
     * @param {string[]} documentIds - Array of document IDs
     * @returns {Promise}
     */
    exportAsZip: async (documentIds) => {
      try {
        const response = await documentAPI.post('/documents/export-zip', { documentIds }, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to export documents');
      }
    },
  },
};

// Export both default and named exports
export default documentService;
export const {
  upload,
  management,
  access,
  verification,
  analytics,
  categories,
  templates,
} = documentService;

// Hook for using document service in React components
export const useDocumentService = () => {
  return documentService;
};

// Utility functions for document handling
export const documentUtils = {
  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile: (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('File extension not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileSize: file.size,
      fileType: file.type,
      fileExtension,
    };
  },

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file icon based on type
   * @param {string} fileType - MIME type or file extension
   * @returns {string} Icon class name
   */
  getFileIcon: (fileType) => {
    if (fileType.includes('image')) return 'fas fa-file-image';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fas fa-file-excel';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fas fa-file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'fas fa-file-archive';
    if (fileType.includes('text')) return 'fas fa-file-alt';
    return 'fas fa-file';
  },

  /**
   * Get document category based on type and content
   * @param {Object} document - Document object
   * @returns {string} Category name
   */
  getDocumentCategory: (document) => {
    const type = document.type || document.mimeType || '';
    
    if (type.includes('resume') || type.includes('cv')) return 'Resume';
    if (type.includes('certificate') || type.includes('diploma')) return 'Certificates';
    if (type.includes('portfolio') || type.includes('project')) return 'Portfolio';
    if (type.includes('identity') || type.includes('passport')) return 'Identity';
    if (type.includes('academic') || type.includes('transcript')) return 'Academic';
    if (type.includes('image')) return 'Images';
    if (type.includes('pdf')) return 'Documents';
    
    return 'Other';
  },

  /**
   * Check if document is image
   * @param {string} mimeType - MIME type
   * @returns {boolean}
   */
  isImage: (mimeType) => {
    return mimeType.startsWith('image/');
  },

  /**
   * Check if document is PDF
   * @param {string} mimeType - MIME type
   * @returns {boolean}
   */
  isPDF: (mimeType) => {
    return mimeType === 'application/pdf';
  },

  /**
   * Generate file preview URL
   * @param {Object} document - Document object
   * @returns {string} Preview URL
   */
  generatePreviewUrl: (document) => {
    if (documentUtils.isImage(document.mimeType)) {
      return document.url || document.previewUrl;
    }
    
    if (documentUtils.isPDF(document.mimeType)) {
      return `/documents/${document.id}/preview`;
    }
    
    return null;
  },

  /**
   * Calculate storage usage percentage
   * @param {number} used - Used storage in bytes
   * @param {number} total - Total storage in bytes
   * @returns {number} Usage percentage
   */
  calculateStorageUsage: (used, total) => {
    return total > 0 ? (used / total) * 100 : 0;
  },

  /**
   * Get storage usage level (low, medium, high, full)
   * @param {number} used - Used storage in bytes
   * @param {number} total - Total storage in bytes
   * @returns {string} Usage level
   */
  getStorageUsageLevel: (used, total) => {
    const percentage = documentUtils.calculateStorageUsage(used, total);
    
    if (percentage >= 90) return 'full';
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  },
};
export {documentService}