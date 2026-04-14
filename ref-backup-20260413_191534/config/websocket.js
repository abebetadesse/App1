/* eslint-disable no-unused-vars */
export const WEBSOCKET_CONFIG = {
  enabled: process.env.NODE_ENV === 'production', // Disable in dev to prevent errors
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  reconnectAttempts: 3,
  reconnectDelay: 3000
};

export const isWebSocketSupported = () => {
  return typeof WebSocket !== 'undefined' || typeof window !== 'undefined';
};