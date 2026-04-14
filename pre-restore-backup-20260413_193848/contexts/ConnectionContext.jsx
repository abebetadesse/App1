import React, { createContext, useContext, useState } from 'react';
const ConnectionContext = createContext({});
export const useConnectionManager = () => useContext(ConnectionContext);
export const ConnectionProvider = ({ children }) => {
  const [activeConnections, setActiveConnections] = useState([]);
  const initializeConnections = () => setActiveConnections([{ id: 1, name: 'Demo' }]);
  return <ConnectionContext.Provider value={{ activeConnections, initializeConnections }}>{children}</ConnectionContext.Provider>;
};
