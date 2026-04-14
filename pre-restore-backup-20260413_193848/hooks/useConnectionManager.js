/* eslint-disable no-unused-vars */
// hooks/useConnectionManager.js
import { useState, useEffect, useCallback } from 'react';
import { connectionApi } from '../services/connections';
import { useWebSocket } from './useWebSocket';

export const useConnectionManager = (userRole, userId) => {
  const [connections, setConnections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { lastMessage, sendMessage } = useWebSocket();

  // Listen for real-time connection notifications
  useEffect(() => {
    if (lastMessage?.type === 'new_connection') {
      const newConnection = lastMessage.data;
      setConnections(prev => [newConnection, ...prev]);
      
      // Add to notifications if user is profile owner
      if (userRole === 'profile_owner') {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'connection',
          title: 'New Client Connection',
          message: `Client selected your profile. Call: ${newConnection.clientPhone}`,
          connectionId: newConnection.id,
          timestamp: new Date()
        }, ...prev]);
      }
    }
  }, [lastMessage, userRole]);

  const createConnection = useCallback(async (clientId, profileOwnerId) => {
    setLoading(true);
    
      const connection = await connectionApi.create(clientId, profileOwnerId);
      setConnections(prev => [connection, ...prev]);
      return connection;

      setLoading(false);
  }, []);

  const markCallMade = useCallback(async (connectionId) => {
    try {
      await connectionApi.markCallMade(connectionId);
      setConnections(prev => prev.map(conn =>
        conn.id === connectionId 
          ? { ...conn, called: true, calledAt: new Date() }
          : conn
      ));
    } catch (error) {
      throw error;
    }
  }, []);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    try {
      const userConnections = await connectionApi.getByUser(userId, userRole);
      setConnections(userConnections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  // Load connections on mount
  useEffect(() => {
    if (userId) {
      loadConnections();
    }
  }, [userId, loadConnections]);

  return {
    connections,
    notifications,
    loading,
    createConnection,
    markCallMade,
    loadConnections,
    unreadCount: notifications.filter(n => !n.read).length
  };
};