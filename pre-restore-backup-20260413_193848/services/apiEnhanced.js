import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

// Simple in-memory cache
const cache = new Map();
const pendingRequests = new Map();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Add request interceptor for caching
api.interceptors.request.use((config) => {
  const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
  if (config.method === 'get' && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < 30000) { // 30s TTL
      config.adapter = () => Promise.resolve({ data: cached.data, status: 200 });
    }
  }
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }
  const requestPromise = new Promise((resolve, reject) => {
    const abortController = new AbortController();
    config.signal = abortController.signal;
    // Store abort controller for cancellation
    config.abortController = abortController;
    resolve();
  });
  return config;
});

api.interceptors.response.use((response) => {
  const cacheKey = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params)}`;
  if (response.config.method === 'get') {
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    pendingRequests.delete(cacheKey);
  }
  return response;
}, (error) => {
  if (error.config && error.config.abortController) {
    error.config.abortController.abort();
  }
  return Promise.reject(error);
});

export default api;
