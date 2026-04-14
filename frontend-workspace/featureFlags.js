export const initializeFeatureFlags = async () => {
  console.log('Feature flags initialized');
  return { flags: {} };
};

export const isFeatureEnabled = (flagName) => {
  // Default to true for development
  return true;
};

export const getFeatureFlag = (flagName) => {
  return true;
};

export default { initializeFeatureFlags, isFeatureEnabled, getFeatureFlag };
