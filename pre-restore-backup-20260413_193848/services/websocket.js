import io from 'socket.io-client';

let socket = null;

export const initWebSocket = () => {
  if (socket && socket.connected) return socket;
  
  const SOCKET_URL = 'http://localhost:3005';
  
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    path: '/socket.io/',
    auth: { token: localStorage.getItem('auth_token') },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  });
  
  socket.on('connect', () => console.log('✅ WebSocket connected to', SOCKET_URL));
  socket.on('connect_error', (err) => console.warn('⚠️ WebSocket error:', err.message));
  socket.on('disconnect', () => console.log('🔴 WebSocket disconnected'));
  
  return socket;
};

export const getSocket = () => socket;
