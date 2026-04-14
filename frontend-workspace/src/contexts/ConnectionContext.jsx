import React, { createContext, useContext } from 'react';

const ConnectionContext = createContext(null);

export const ConnectionProvider = ({ children }) => {
  const value = {
    activeConnections: [],
    initializeConnections: () => {},
    getActiveConnections: () => []
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionManager = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    console.warn('useConnectionManager must be used within ConnectionProvider');
    return { activeConnections: [], initializeConnections: () => {} };
  }
  return context;
};

export default ConnectionContext;
