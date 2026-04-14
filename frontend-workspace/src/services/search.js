import api from './api';
export const searchProfiles = (filters) => api.post('/search/profiles', { filters });
