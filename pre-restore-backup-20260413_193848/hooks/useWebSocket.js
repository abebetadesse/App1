/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('new_connection', (data) => {
      setLastMessage({ type: 'new_connection', data });
    });

    socketRef.current.on('notification', (data) => {
      setLastMessage({ type: 'notification', data });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};