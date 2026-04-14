import React, { useState, useEffect } from 'react';
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  return <div className="notification-center">{notifications.map((n,i)=><div key={i}>{n.message}</div>)}</div>;
};
export default NotificationCenter;
