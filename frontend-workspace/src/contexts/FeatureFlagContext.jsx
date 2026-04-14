import React, { createContext, useContext } from 'react';

const FeatureFlagContext = createContext(null);

export const FeatureFlagProvider = ({ children }) => {
  const flags = {
    maintenance_mode: false,
    ai_enhancements: true,
    ai_performance_tracking: false,
    home_page_ai_v3: true,
    auth_ai_v2: true,
    profile_owner_dashboard_ai_v3: true,
    client_dashboard_ai_v3: true,
    ai_search_v2: true,
    moodle_integration_v2: true,
    connection_manager_v1: true,
  };

  // Provide both `enabled` as a boolean getter and `isEnabled` function
  const value = {
    flags,
    isEnabled: (flagName) => !!flags[flagName],
    enabled: (flagName) => !!flags[flagName],
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlag = (flagName) => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    console.warn('useFeatureFlag must be used within FeatureFlagProvider');
    return flagName === 'maintenance_mode' ? false : true;
  }
  // Support both `enabled` function and direct boolean
  return typeof context.isEnabled === 'function' 
    ? context.isEnabled(flagName) 
    : !!context.flags?.[flagName];
};

export default FeatureFlagContext;
