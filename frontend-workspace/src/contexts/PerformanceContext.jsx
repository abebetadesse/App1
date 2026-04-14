import React, { createContext, useContext } from 'react';

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
  const markMetric = (name, value, tags) => {
    if (import.meta.env.DEV) console.log(`[Perf] ${name}:`, value);
  };

  const recordMetric = (name, value, tags) => {
    // Record to analytics in production
  };

  const predictPerformance = async (componentName, loadTime) => {
    return {
      accuracy: 85,
      anomaly: false,
      expected: 100,
      deviation: 0,
      moodleImpact: 0
    };
  };

  const trackNavigation = (from, to, duration) => {
    if (import.meta.env.DEV) console.log(`[Nav] ${from} -> ${to} (${duration}ms)`);
  };

  const predictNextRoute = async (history, context) => {
    return { confidence: 0, route: '' };
  };

  const value = {
    markMetric,
    recordMetric,
    predictPerformance,
    trackNavigation,
    predictNextRoute
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceMetrics = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    console.warn('usePerformanceMetrics must be used within PerformanceProvider');
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
