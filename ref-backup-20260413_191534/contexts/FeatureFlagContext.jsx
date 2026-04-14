import React, { createContext, useContext, useMemo } from 'react';
const FeatureFlagContext = createContext({});
export const useFeatureFlag = (name) => ({ enabled: true });
export const FeatureFlagProvider = ({ children }) => {
  const flags = useMemo(() => ({}), []);
  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
};
