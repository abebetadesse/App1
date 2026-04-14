import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
const NotificationContext = createContext({});
export const useNotification = () => useContext(NotificationContext);
export const NotificationProvider = ({ children }) => {
  const showNotification = ({ type, title, message }) => toast[type || 'info'](message || title);
  return <NotificationContext.Provider value={{ showNotification }}>{children}</NotificationContext.Provider>;
};
