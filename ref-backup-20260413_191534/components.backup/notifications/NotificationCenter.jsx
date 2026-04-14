import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../services/websocket';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
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
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio not supported'));
      });
    }
    return () => socket?.off('new_notification');
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 hover:bg-gray-100 rounded-full">
        🔔
        {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4">{unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border">
          <div className="p-2 border-b font-semibold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && <p className="p-4 text-center text-gray-500">No notifications</p>}
            {notifications.map(n => (
              <div key={n.id} className={`p-3 border-b ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <p className="font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
