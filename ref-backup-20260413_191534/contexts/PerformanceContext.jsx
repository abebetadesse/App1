import React, { createContext, useContext } from 'react';
const PerformanceContext = createContext({});
export const usePerformanceMetrics = () => useContext(PerformanceContext);
export const PerformanceProvider = ({ children }) => <PerformanceContext.Provider value={{ markMetric: () => {}, recordMetric: () => {}, predictPerformance: () => Promise.resolve({}), trackNavigation: () => {}, predictNextRoute: () => Promise.resolve({}) }}>{children}</PerformanceContext.Provider>;
