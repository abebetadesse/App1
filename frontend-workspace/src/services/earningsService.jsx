import React from "react";
/* eslint-disable no-unused-vars */
import axios from 'axios';

// Create axios instance with base configuration
const earningsAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
earningsAPI.interceptors.request.use(
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
earningsAPI.interceptors.response.use(
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

const earningsService = {
  // Earnings Overview and Analytics
  overview: {
    /**
     * Get earnings overview and summary
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getEarningsOverview: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.period) params.append('period', options.period); // daily, weekly, monthly, yearly

        const response = await earningsAPI.get(`/earnings/overview?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings overview');
      }
    },

    /**
     * Get earnings statistics
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getEarningsStats: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await earningsAPI.get(`/earnings/stats?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings statistics');
      }
    },

    /**
     * Get earnings growth metrics
     * @param {Object} options - Comparison options
     * @returns {Promise}
     */
    getGrowthMetrics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.compareWith) params.append('compareWith', options.compareWith); // previous_period, same_period_last_year

        const response = await earningsAPI.get(`/earnings/growth?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get growth metrics');
      }
    },

    /**
     * Get projected earnings
     * @param {Object} options - Projection options
     * @returns {Promise}
     */
    getProjectedEarnings: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.period) params.append('period', options.period); // next_week, next_month, next_quarter
        if (options.basedOn) params.append('basedOn', options.basedOn); // historical, current_trend

        const response = await earningsAPI.get(`/earnings/projections?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get projected earnings');
      }
    },
  },

  // Transaction History Services
  transactions: {
    /**
     * Get earnings transactions
     * @param {Object} options - Filtering and pagination options
     * @returns {Promise}
     */
    getTransactions: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.type) params.append('type', options.type);
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);

        const response = await earningsAPI.get(`/earnings/transactions?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get transactions');
      }
    },

    /**
     * Get transaction details
     * @param {string} transactionId - Transaction ID
     * @returns {Promise}
     */
    getTransactionDetails: async (transactionId) => {
      try {
        const response = await earningsAPI.get(`/earnings/transactions/${transactionId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get transaction details');
      }
    },

    /**
     * Export transactions to CSV/Excel
     * @param {Object} options - Export options
     * @returns {Promise}
     */
    exportTransactions: async (options = {}) => {
      try {
        const response = await earningsAPI.post('/earnings/transactions/export', options, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to export transactions');
      }
    },

    /**
     * Search transactions
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Promise}
     */
    searchTransactions: async (query, options = {}) => {
      try {
        const params = new URLSearchParams();
        params.append('q', query);
        if (options.type) params.append('type', options.type);
        if (options.status) params.append('status', options.status);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await earningsAPI.get(`/earnings/transactions/search?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to search transactions');
      }
    },
  },

  // Payment and Withdrawal Services
  payments: {
    /**
     * Request withdrawal
     * @param {Object} withdrawalData - Withdrawal details
     * @returns {Promise}
     */
    requestWithdrawal: async (withdrawalData) => {
      try {
        const response = await earningsAPI.post('/earnings/withdrawals', withdrawalData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to request withdrawal');
      }
    },

    /**
     * Get withdrawal history
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getWithdrawals: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.status) params.append('status', options.status);
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await earningsAPI.get(`/earnings/withdrawals?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get withdrawals');
      }
    },

    /**
     * Cancel withdrawal request
     * @param {string} withdrawalId - Withdrawal ID
     * @returns {Promise}
     */
    cancelWithdrawal: async (withdrawalId) => {
      try {
        const response = await earningsAPI.put(`/earnings/withdrawals/${withdrawalId}/cancel`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to cancel withdrawal');
      }
    },

    /**
     * Get withdrawal limits and fees
     * @returns {Promise}
     */
    getWithdrawalLimits: async () => {
      try {
        const response = await earningsAPI.get('/earnings/withdrawal-limits');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get withdrawal limits');
      }
    },

    /**
     * Calculate withdrawal fee
     * @param {number} amount - Withdrawal amount
     * @param {string} method - Payment method
     * @returns {Promise}
     */
    calculateWithdrawalFee: async (amount, method) => {
      try {
        const response = await earningsAPI.post('/earnings/calculate-fee', {
          amount,
          method,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to calculate withdrawal fee');
      }
    },
  },

  // Payment Methods Services
  paymentMethods: {
    /**
     * Get payment methods
     * @returns {Promise}
     */
    getPaymentMethods: async () => {
      try {
        const response = await earningsAPI.get('/earnings/payment-methods');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get payment methods');
      }
    },

    /**
     * Add payment method
     * @param {Object} paymentMethodData - Payment method details
     * @returns {Promise}
     */
    addPaymentMethod: async (paymentMethodData) => {
      try {
        const response = await earningsAPI.post('/earnings/payment-methods', paymentMethodData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add payment method');
      }
    },

    /**
     * Update payment method
     * @param {string} methodId - Payment method ID
     * @param {Object} updates - Payment method updates
     * @returns {Promise}
     */
    updatePaymentMethod: async (methodId, updates) => {
      try {
        const response = await earningsAPI.put(`/earnings/payment-methods/${methodId}`, updates);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update payment method');
      }
    },

    /**
     * Delete payment method
     * @param {string} methodId - Payment method ID
     * @returns {Promise}
     */
    deletePaymentMethod: async (methodId) => {
      try {
        const response = await earningsAPI.delete(`/earnings/payment-methods/${methodId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete payment method');
      }
    },

    /**
     * Set default payment method
     * @param {string} methodId - Payment method ID
     * @returns {Promise}
     */
    setDefaultPaymentMethod: async (methodId) => {
      try {
        const response = await earningsAPI.put(`/earnings/payment-methods/${methodId}/default`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to set default payment method');
      }
    },

    /**
     * Verify payment method
     * @param {string} methodId - Payment method ID
     * @param {Object} verificationData - Verification data
     * @returns {Promise}
     */
    verifyPaymentMethod: async (methodId, verificationData) => {
      try {
        const response = await earningsAPI.post(`/earnings/payment-methods/${methodId}/verify`, verificationData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to verify payment method');
      }
    },
  },

  // Commission and Fee Services
  commissions: {
    /**
     * Get commission structure
     * @returns {Promise}
     */
    getCommissionStructure: async () => {
      try {
        const response = await earningsAPI.get('/earnings/commissions/structure');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get commission structure');
      }
    },

    /**
     * Calculate commission for a project
     * @param {number} projectAmount - Project amount
     * @param {string} projectType - Project type
     * @returns {Promise}
     */
    calculateCommission: async (projectAmount, projectType) => {
      try {
        const response = await earningsAPI.post('/earnings/commissions/calculate', {
          projectAmount,
          projectType,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to calculate commission');
      }
    },

    /**
     * Get commission history
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getCommissionHistory: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);

        const response = await earningsAPI.get(`/earnings/commissions/history?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get commission history');
      }
    },

    /**
     * Get platform fees
     * @returns {Promise}
     */
    getPlatformFees: async () => {
      try {
        const response = await earningsAPI.get('/earnings/fees');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get platform fees');
      }
    },
  },

  // Tax and Reporting Services
  taxes: {
    /**
     * Get tax information
     * @returns {Promise}
     */
    getTaxInfo: async () => {
      try {
        const response = await earningsAPI.get('/earnings/tax-info');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get tax information');
      }
    },

    /**
     * Update tax information
     * @param {Object} taxData - Tax information
     * @returns {Promise}
     */
    updateTaxInfo: async (taxData) => {
      try {
        const response = await earningsAPI.put('/earnings/tax-info', taxData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update tax information');
      }
    },

    /**
     * Generate tax report
     * @param {Object} options - Report options
     * @returns {Promise}
     */
    generateTaxReport: async (options = {}) => {
      try {
        const response = await earningsAPI.post('/earnings/tax-reports', options, {
          responseType: 'blob',
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to generate tax report');
      }
    },

    /**
     * Get tax documents
     * @param {Object} options - Filtering options
     * @returns {Promise}
     */
    getTaxDocuments: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.year) params.append('year', options.year);
        if (options.type) params.append('type', options.type);

        const response = await earningsAPI.get(`/earnings/tax-documents?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get tax documents');
      }
    },

    /**
     * Calculate estimated taxes
     * @param {Object} options - Calculation options
     * @returns {Promise}
     */
    calculateEstimatedTaxes: async (options = {}) => {
      try {
        const response = await earningsAPI.post('/earnings/calculate-taxes', options);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to calculate estimated taxes');
      }
    },
  },

  // Analytics and Insights Services
  analytics: {
    /**
     * Get earnings analytics
     * @param {Object} options - Analytics options
     * @returns {Promise}
     */
    getEarningsAnalytics: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.period) params.append('period', options.period);
        if (options.metric) params.append('metric', options.metric);
        if (options.groupBy) params.append('groupBy', options.groupBy);

        const response = await earningsAPI.get(`/earnings/analytics?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings analytics');
      }
    },

    /**
     * Get earnings by category
     * @param {Object} options - Date range options
     * @returns {Promise}
     */
    getEarningsByCategory: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.startDate) params.append('startDate', options.startDate);
        if (options.endDate) params.append('endDate', options.endDate);

        const response = await earningsAPI.get(`/earnings/analytics/categories?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings by category');
      }
    },

    /**
     * Get earnings trends
     * @param {Object} options - Trend analysis options
     * @returns {Promise}
     */
    getEarningsTrends: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.period) params.append('period', options.period);
        if (options.compareWith) params.append('compareWith', options.compareWith);

        const response = await earningsAPI.get(`/earnings/analytics/trends?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings trends');
      }
    },

    /**
     * Get performance insights
     * @returns {Promise}
     */
    getPerformanceInsights: async () => {
      try {
        const response = await earningsAPI.get('/earnings/analytics/insights');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get performance insights');
      }
    },

    /**
     * Compare with peers
     * @param {Object} options - Comparison options
     * @returns {Promise}
     */
    compareWithPeers: async (options = {}) => {
      try {
        const params = new URLSearchParams();
        if (options.category) params.append('category', options.category);
        if (options.experienceLevel) params.append('experienceLevel', options.experienceLevel);

        const response = await earningsAPI.get(`/earnings/analytics/peer-comparison?${params}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to compare with peers');
      }
    },
  },

  // Settings and Preferences
  settings: {
    /**
     * Get earnings settings
     * @returns {Promise}
     */
    getSettings: async () => {
      try {
        const response = await earningsAPI.get('/earnings/settings');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get earnings settings');
      }
    },

    /**
     * Update earnings settings
     * @param {Object} settings - Earnings settings
     * @returns {Promise}
     */
    updateSettings: async (settings) => {
      try {
        const response = await earningsAPI.put('/earnings/settings', settings);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update earnings settings');
      }
    },

    /**
     * Get notification preferences
     * @returns {Promise}
     */
    getNotificationPreferences: async () => {
      try {
        const response = await earningsAPI.get('/earnings/notifications');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get notification preferences');
      }
    },

    /**
     * Update notification preferences
     * @param {Object} preferences - Notification preferences
     * @returns {Promise}
     */
    updateNotificationPreferences: async (preferences) => {
      try {
        const response = await earningsAPI.put('/earnings/notifications', preferences);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update notification preferences');
      }
    },

    /**
     * Get payout schedule
     * @returns {Promise}
     */
    getPayoutSchedule: async () => {
      try {
        const response = await earningsAPI.get('/earnings/payout-schedule');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get payout schedule');
      }
    },
  },

  // Support and Disputes
  support: {
    /**
     * Report payment issue
     * @param {Object} issueData - Issue details
     * @returns {Promise}
     */
    reportPaymentIssue: async (issueData) => {
      try {
        const response = await earningsAPI.post('/earnings/support/issues', issueData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to report payment issue');
      }
    },

    /**
     * Dispute a transaction
     * @param {string} transactionId - Transaction ID
     * @param {Object} disputeData - Dispute details
     * @returns {Promise}
     */
    disputeTransaction: async (transactionId, disputeData) => {
      try {
        const response = await earningsAPI.post(`/earnings/transactions/${transactionId}/dispute`, disputeData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to dispute transaction');
      }
    },

    /**
     * Get dispute status
     * @param {string} disputeId - Dispute ID
     * @returns {Promise}
     */
    getDisputeStatus: async (disputeId) => {
      try {
        const response = await earningsAPI.get(`/earnings/disputes/${disputeId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get dispute status');
      }
    },
  },
};

// Export both default and named exports
export default earningsService;
export const {
  overview,
  transactions,
  payments,
  paymentMethods,
  commissions,
  taxes,
  analytics,
  settings,
  support,
} = earningsService;

// Hook for using earnings service in React components
export const useEarningsService = () => {
  return earningsService;
};

// Utility functions for earnings management
export const earningsUtils = {
  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale string
   * @returns {string} Formatted currency
   */
  formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Format percentage for display
   * @param {number} value - Percentage value (0-100)
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  formatPercentage: (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Calculate net earnings after fees and taxes
   * @param {number} grossAmount - Gross amount
   * @param {number} platformFee - Platform fee percentage
   * @param {number} taxRate - Tax rate percentage
   * @returns {Object} Calculated amounts
   */
  calculateNetEarnings: (grossAmount, platformFee = 10, taxRate = 15) => {
    const platformFeeAmount = (grossAmount * platformFee) / 100;
    const amountAfterFees = grossAmount - platformFeeAmount;
    const taxAmount = (amountAfterFees * taxRate) / 100;
    const netAmount = amountAfterFees - taxAmount;

    return {
      grossAmount,
      platformFee: platformFeeAmount,
      platformFeePercentage: platformFee,
      taxAmount,
      taxRate,
      netAmount,
    };
  },

  /**
   * Format transaction status for display
   * @param {string} status - Transaction status
   * @returns {Object} Formatted status with color and text
   */
  formatTransactionStatus: (status) => {
    const statusMap = {
      pending: { text: 'Pending', color: 'warning', variant: 'warning' },
      completed: { text: 'Completed', color: 'success', variant: 'success' },
      failed: { text: 'Failed', color: 'danger', variant: 'danger' },
      cancelled: { text: 'Cancelled', color: 'secondary', variant: 'secondary' },
      processing: { text: 'Processing', color: 'info', variant: 'info' },
      refunded: { text: 'Refunded', color: 'info', variant: 'info' },
      disputed: { text: 'Disputed', color: 'danger', variant: 'danger' },
    };

    return statusMap[status] || { text: 'Unknown', color: 'secondary', variant: 'secondary' };
  },

  /**
   * Format payment method for display
   * @param {string} method - Payment method
   * @returns {Object} Formatted method with icon and text
   */
  formatPaymentMethod: (method) => {
    const methodMap = {
      bank_transfer: { text: 'Bank Transfer', icon: 'fas fa-university' },
      paypal: { text: 'PayPal', icon: 'fab fa-paypal' },
      stripe: { text: 'Stripe', icon: 'fab fa-stripe' },
      credit_card: { text: 'Credit Card', icon: 'fas fa-credit-card' },
      debit_card: { text: 'Debit Card', icon: 'fas fa-credit-card' },
      cryptocurrency: { text: 'Cryptocurrency', icon: 'fab fa-bitcoin' },
      mobile_money: { text: 'Mobile Money', icon: 'fas fa-mobile-alt' },
    };

    return methodMap[method] || { text: 'Unknown', icon: 'fas fa-money-bill' };
  },

  /**
   * Calculate earnings growth rate
   * @param {number} current - Current period earnings
   * @param {number} previous - Previous period earnings
   * @returns {number} Growth rate percentage
   */
  calculateGrowthRate: (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * Generate period labels for charts
   * @param {string} period - Period type
   * @param {number} count - Number of periods
   * @returns {Array} Period labels
   */
  generatePeriodLabels: (period = 'monthly', count = 6) => {
    const labels = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);

      switch (period) {
        case 'daily':
          date.setDate(now.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          break;
        case 'weekly':
          date.setDate(now.getDate() - (i * 7));
          labels.push(`Week ${Math.ceil(date.getDate() / 7)}`);
          break;
        case 'monthly':
          date.setMonth(now.getMonth() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
          break;
        case 'yearly':
          date.setFullYear(now.getFullYear() - i);
          labels.push(date.getFullYear().toString());
          break;
        default:
          labels.push(`Period ${i + 1}`);
      }
    }

    return labels.reverse();
  },

  /**
   * Validate withdrawal amount
   * @param {number} amount - Withdrawal amount
   * @param {number} availableBalance - Available balance
   * @param {number} minWithdrawal - Minimum withdrawal amount
   * @param {number} maxWithdrawal - Maximum withdrawal amount
   * @returns {Object} Validation result
   */
  validateWithdrawalAmount: (amount, availableBalance, minWithdrawal = 10, maxWithdrawal = 10000) => {
    const errors = [];

    if (amount < minWithdrawal) {
      errors.push(`Minimum withdrawal amount is ${earningsUtils.formatCurrency(minWithdrawal)}`);
    }

    if (amount > maxWithdrawal) {
      errors.push(`Maximum withdrawal amount is ${earningsUtils.formatCurrency(maxWithdrawal)}`);
    }

    if (amount > availableBalance) {
      errors.push('Insufficient balance for withdrawal');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Calculate estimated payout date
   * @param {string} requestDate - Withdrawal request date
   * @param {number} processingDays - Processing days
   * @returns {Date} Estimated payout date
   */
  calculatePayoutDate: (requestDate, processingDays = 3) => {
    const payoutDate = new Date(requestDate);
    payoutDate.setDate(payoutDate.getDate() + processingDays);

    // Skip weekends
    while (payoutDate.getDay() === 0 || payoutDate.getDay() === 6) {
      payoutDate.setDate(payoutDate.getDate() + 1);
    }

    return payoutDate;
  },

  /**
   * Group transactions by date
   * @param {Array} transactions - Transactions array
   * @returns {Object} Grouped transactions
   */
  groupTransactionsByDate: (transactions) => {
    const grouped = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return grouped;
  },
};

export {earningsService}