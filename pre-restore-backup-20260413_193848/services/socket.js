import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3005';
  socket = io(SOCKET_URL, { transports: ['websocket'], auth: { token: localStorage.getItem('auth_token') } });
  socket.on('connect', () => console.log('Socket connected'));
  socket.on('proposal_update', (data) => console.log('Proposal update:', data));
  return socket;
};

export const getSocket = () => socket;
