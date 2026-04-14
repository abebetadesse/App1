import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../services/websocket';
import { Bell, X } from 'lucide-react';

const NotificationBell = forwardRef((props, ref) {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch('/api/notifications')
      .then(res => res.json())
      .then(setNotifications);
    const socket = getSocket();
    if (socket) {
      socket.on('new_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });
    }
    return () => socket?.off('new_notification');
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative p-2 hover:bg-gray-100 rounded-full">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>}
      </button>
      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border">
          <div className="p-2 border-b flex justify-between">
            <span className="font-semibold">Notifications</span>
            <button onClick={() => setShow(false)}><X size={16} /></button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? <p className="p-4 text-center text-gray-500">No notifications</p> : notifications.map(n => (
              <div key={n.id} className={`p-3 border-b ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
NotificationBell.displayName = 'NotificationBell';
