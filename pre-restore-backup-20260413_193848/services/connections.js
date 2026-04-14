/* eslint-disable no-unused-vars */
import api from './api';

export const connectionApi = {
  // Create a new connection
  create: async (clientId, profileOwnerId, searchQueryId = null) => {
    const response = await api.post('/api/connections', {
      clientId,
      profileOwnerId,
      searchQueryId
    });
    return response.data;
  },

  // Mark call as made
  markCallMade: async (connectionId, callDuration = null) => {
    const response = await api.put(`/api/connections/${connectionId}/call-made`, {
      callDuration
    });
    return response.data;
  },

  // Provide feedback
  provideFeedback: async (connectionId, feedback) => {
    const response = await api.put(`/api/connections/${connectionId}/feedback`, feedback);
    return response.data;
  },

  // Get connections by client
  getByClient: async (clientId) => {
    const response = await api.get(`/api/connections/client/${clientId}`);
    return response.data;
  },

  // Get connections by profile owner
  getByProfileOwner: async (profileOwnerId) => {
    const response = await api.get(`/api/connections/profile-owner/${profileOwnerId}`);
    return response.data;
  },

  // Get connection by ID
  getById: async (connectionId) => {
    const response = await api.get(`/api/connections/${connectionId}`);
    return response.data;
  },

  // Get connection statistics
  getStats: async () => {
    const response = await api.get('/api/analytics/connections');
    return response.data;
  }
};