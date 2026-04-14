import React, { createContext, useContext } from 'react';

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
  const markMetric = (name, value, tags) => {};
  const recordMetric = (name, value, tags) => {};
  const predictPerformance = async (component, loadTime) => ({
    accuracy: 0,
    anomaly: false,
    moodleImpact: 0
  });
  const trackNavigation = (from, to, duration) => {};
  const predictNextRoute = async (history, context) => ({ confidence: 0, route: '' });

  return (
    <PerformanceContext.Provider value={{
      markMetric,
      recordMetric,
      predictPerformance,
      trackNavigation,
      predictNextRoute
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceMetrics = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    return {
      markMetric: () => {},
      recordMetric: () => {},
      predictPerformance: async () => ({}),
      trackNavigation: () => {},
      predictNextRoute: async () => ({})
    };
  }
  return context;
};

export default PerformanceContext;
