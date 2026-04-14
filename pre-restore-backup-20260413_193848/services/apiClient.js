import axios from 'axios';
import { logError, logInfo } from './loggingService';
import { trackEvent } from '../utils/analytics';

// API Client with interceptors, retries, and error handling
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor – add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    logInfo('API Request', { url: config.url, method: config.method });
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        localStorage.setItem('auth_token', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    logError('API Error', { url: originalRequest?.url, error: error.message });
    trackEvent('api_error', { endpoint: originalRequest?.url, status: error.response?.status });
    return Promise.reject(error);
  }
);

// Retry wrapper
export const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) { if (i === retries - 1) throw err; await new Promise(r => setTimeout(r, delay * Math.pow(2, i))); }
  }
};

export default apiClient;
