import React, { useState, useEffect } from 'react';
const NetworkStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handle = () => setOnline(navigator.onLine);
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
    return () => { window.removeEventListener('online', handle); window.removeEventListener('offline', handle); };
  }, []);
  return online ? null : <div className="bg-yellow-500 text-white p-2 text-center">Offline Mode</div>;
};
export default NetworkStatus;
