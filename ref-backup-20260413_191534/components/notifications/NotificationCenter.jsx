import React, { forwardRef, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../services/websocket';

const NotificationCenter = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on('notification', (data) => setNotifications(prev => [data, ...prev]));
    }
    return () => { if (socket) socket.off('notification'); };
  }, []);

  return (
    <div ref={ref} className="notification-center">
      {notifications.map((n, i) => <div key={i}>{n.message}</div>)}
    </div>
  );
});
NotificationCenter.displayName = 'NotificationCenter';
export default NotificationCenter;
